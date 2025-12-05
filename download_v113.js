// content.js - downloadImageAsync 重构版 (V1.1.3)

async function downloadImageAsync(index) {
    return new Promise((resolve) => {
        try {
            console.log(`[Task ${index}] 准备提取图片...`);

            // 1. 查找有效大图 (过滤掉头像、图标)
            const allImages = Array.from(document.querySelectorAll('img[src^="https://lh3.googleusercontent.com"]'));
            const validImages = allImages.filter(img => {
                return img.complete &&
                    img.naturalWidth > 300 &&
                    img.naturalHeight > 300 &&
                    !img.src.includes('profile_photo');
            });

            console.log(`[Task ${index}] 找到 ${allImages.length} 张图片，筛选出 ${validImages.length} 张有效大图`);

            // 取最后一张（当前生成的）
            const targetImg = validImages[validImages.length - 1];

            if (targetImg && targetImg.src) {
                let finalUrl = targetImg.src;

                console.log(`[Task ${index}] 原始URL:`, finalUrl.substring(0, 80) + '...');

                // 2. 高清化处理 (=s0 规则)
                if (finalUrl.includes('=')) {
                    const baseUrl = finalUrl.split('=')[0];
                    finalUrl = `${baseUrl}=s0`;
                    console.log(`[Task ${index}] 链接已升级为原图 (=s0)`);
                }

                console.log(`[Task ${index}] 高清URL:`, finalUrl.substring(0, 80) + '...');

                // 3. 发送给后台下载
                chrome.runtime.sendMessage({
                    action: 'download_hq',
                    url: finalUrl,
                    filename: `page${index}.png`
                }, (response) => {
                    // 错误检查：处理连接断开或后台报错
                    if (chrome.runtime.lastError) {
                        console.error(`❌ [Task ${index}] 通信错误:`, chrome.runtime.lastError.message);
                    } else if (response && response.status === 'error') {
                        console.error(`❌ [Task ${index}] 后台下载报错:`, response.message);
                    } else if (response && response.status === 'success') {
                        console.log(`✅ [Task ${index}] 下载指令已发送 (Download ID: ${response.downloadId})`);
                    }

                    // 无论成功失败，都 resolve 以保证队列继续
                    resolve();
                });
            } else {
                console.warn(`⚠️ [Task ${index}] 未找到符合条件的图片`);
                resolve();
            }

        } catch (e) {
            console.error(`❌ [Task ${index}] 下载流程异常:`, e);
            resolve();
        }
    });
}
