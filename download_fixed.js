// ========== 下载图片（=s0 高清图方案 + 错误处理） ==========
async function downloadImageAsync(index) {
    console.log(`[Download ${index}] 启动高清图下载流程...`);

    return new Promise(async (resolve) => {
        try {
            // 1. 定位图片：查找所有Google CDN图片
            const images = Array.from(document.querySelectorAll('img[src^="https://lh3.googleusercontent.com"]'));

            // 等待图片完全加载
            await sleep(1000);

            // 2. 筛选：过滤掉头像和图标
            const validImages = images.filter(img => {
                if (!img.complete) return false;
                if (img.naturalWidth <= 300 || img.naturalHeight <= 300) return false;
                if (img.src.includes('profile_photo')) return false;
                return true;
            });

            console.log(`[Download ${index}] 找到 ${images.length} 张图片，筛选出 ${validImages.length} 张有效大图`);

            if (validImages.length === 0) {
                console.warn(`[Download ${index}] 未找到有效图片，跳过下载`);
                resolve(); // 不抛出错误，继续任务
                return;
            }

            // 3. 取最后一张（最新生成的）
            const targetImg = validImages[validImages.length - 1];
            const originalUrl = targetImg.src;

            console.log(`[Download ${index}] 目标图片尺寸: ${targetImg.naturalWidth}x${targetImg.naturalHeight}`);
            console.log(`[Download ${index}] 原始URL:`, originalUrl);

            // 4. 高清化处理：替换URL参数为 =s0
            let highQualityUrl = originalUrl;

            if (highQualityUrl.match(/=w\d+-h\d+/)) {
                highQualityUrl = highQualityUrl.replace(/=w\d+-h\d+/, '=s0');
                console.log(`[Download ${index}] 替换 =w-h 格式为 =s0`);
            } else if (highQualityUrl.match(/=s\d+/)) {
                highQualityUrl = highQualityUrl.replace(/=s\d+/, '=s0');
                console.log(`[Download ${index}] 替换 =s 格式为 =s0`);
            } else if (!highQualityUrl.includes('=s0')) {
                highQualityUrl = highQualityUrl + '=s0';
                console.log(`[Download ${index}] 添加 =s0 参数`);
            }

            console.log(`[Download ${index}] 高清URL:`, highQualityUrl);

            // 5. 发送给 Background 下载（使用回调处理）
            chrome.runtime.sendMessage({
                action: 'download_hq',
                url: highQualityUrl,
                filename: `page${index}.png`
            }, (response) => {
                // 检查通信错误
                if (chrome.runtime.lastError) {
                    console.error(`❌ [Download ${index}] 通信错误:`, chrome.runtime.lastError.message);
                    resolve(); // 不中断任务
                    return;
                }

                // 检查下载结果
                if (response && response.status === 'success') {
                    console.log(`✅ [Download ${index}] 下载已启动 (ID: ${response.downloadId})`);
                } else if (response && response.status === 'error') {
                    console.error(`❌ [Download ${index}] 下载失败:`, response.message);
                } else {
                    console.log(`✅ [Download ${index}] 下载请求已发送`);
                }

                resolve(); // 无论成功失败，都继续任务
            });

        } catch (error) {
            console.error(`❌ [Download ${index}] 下载流程异常:`, error.message);
            resolve(); // 不中断任务
        }
    });
}
