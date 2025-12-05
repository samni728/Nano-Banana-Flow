// ========== 下载图片（=s0 高清图方案） ==========
async function downloadImageAsync(index) {
    console.log(`[Download ${index}] 启动高清图下载流程...`);

    try {
        // 1. 定位图片：查找所有Google CDN图片
        const images = Array.from(document.querySelectorAll('img[src^="https://lh3.googleusercontent.com"]'));

        // 等待图片完全加载
        await sleep(1000);

        // 2. 筛选：过滤掉头像和图标
        const validImages = images.filter(img => {
            // 必须完全加载
            if (!img.complete) return false;

            // 尺寸过滤：宽高都要大于300px
            if (img.naturalWidth <= 300 || img.naturalHeight <= 300) return false;

            // 排除头像：URL中包含 profile_photo 的通常是头像
            if (img.src.includes('profile_photo')) return false;

            return true;
        });

        console.log(`[Download ${index}] 找到 ${images.length} 张图片，筛选出 ${validImages.length} 张有效大图`);

        if (validImages.length === 0) {
            throw new Error('未找到有效的大尺寸图片');
        }

        // 3. 取最后一张（最新生成的）
        const targetImg = validImages[validImages.length - 1];
        const originalUrl = targetImg.src;

        console.log(`[Download ${index}] 目标图片尺寸: ${targetImg.naturalWidth}x${targetImg.naturalHeight}`);
        console.log(`[Download ${index}] 原始URL:`, originalUrl);

        // 4. 高清化处理：替换URL参数为 =s0
        // Google CDN URL格式示例：
        // https://lh3.googleusercontent.com/xxx=w400-h400
        // https://lh3.googleusercontent.com/xxx=s1024
        // 我们要替换为：https://lh3.googleusercontent.com/xxx=s0

        let highQualityUrl = originalUrl;

        // 方法1: 替换 =w数字-h数字 格式
        if (highQualityUrl.match(/=w\d+-h\d+/)) {
            highQualityUrl = highQualityUrl.replace(/=w\d+-h\d+/, '=s0');
            console.log(`[Download ${index}] 替换 =w-h 格式为 =s0`);
        }
        // 方法2: 替换 =s数字 格式
        else if (highQualityUrl.match(/=s\d+/)) {
            highQualityUrl = highQualityUrl.replace(/=s\d+/, '=s0');
            console.log(`[Download ${index}] 替换 =s 格式为 =s0`);
        }
        // 方法3: 如果没有尺寸参数，添加 =s0
        else if (!highQualityUrl.includes('=s0')) {
            highQualityUrl = highQualityUrl + '=s0';
            console.log(`[Download ${index}] 添加 =s0 参数`);
        }

        console.log(`[Download ${index}] 高清URL:`, highQualityUrl);

        // 5. 发送给 Background 下载
        await chrome.runtime.sendMessage({
            action: 'download_hq',
            url: highQualityUrl,
            filename: `page${index}.png`
        });

        console.log(`✅ [Download ${index}] 高清图下载请求已发送`);

    } catch (error) {
        console.error(`❌ [Download ${index}] 下载失败:`, error.message);
        throw error;
    }
}
