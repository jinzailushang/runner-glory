import Replicate from 'replicate';

// 初始化Replicate客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 支持的AI模型配置
export const MODELS = {
  FACE_SWAP: {
    // InsightFace换脸模型
    insightface: "cjwbw/anything-v3-better-vae:09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65",
    // FoFr Face-to-Many风格化模型
    fofr_face_to_many: "fofr/face-to-many:3ed9a87fb1a8b18e92c9c5c6a1e9b5b1c6a7d4e8f9g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z",
    // 其他可选模型
    simswap: "cjwbw/simswap:09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65",
  },
  IMAGE_GENERATION: {
    // Stable Diffusion等其他模型
    stable_diffusion: "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
  }
} as const;

// 换脸函数
export async function swapFace(
  sourceImage: string, // 用户头像URL或base64
  targetImage: string, // 模版图片URL
  model: keyof typeof MODELS.FACE_SWAP = 'insightface'
) {
  try {
    const modelId = MODELS.FACE_SWAP[model];

    const prediction = await replicate.predictions.create({
      version: modelId,
      input: {
        source_image: sourceImage,
        target_image: targetImage,
        // 根据不同模型的输入参数调整
        ...(model === 'insightface' && {
          source_faces_index: [0], // 使用第一张脸
          target_faces_index: [0], // 替换第一张脸
          face_restore: true,
          face_restore_model: "GFPGAN",
          face_restore_visibility: 0.8,
        }),
        ...(model === 'fofr_face_to_many' && {
          style: "photorealistic", // 风格选择
          prompt: "professional marathon runner, realistic, high quality",
        }),
      },
    });

    // 等待结果完成
    const result = await replicate.wait(prediction);

    if (result.status === 'succeeded' && result.output) {
      // 返回生成的图片URL
      return Array.isArray(result.output) ? result.output[0] : result.output;
    } else {
      throw new Error(`AI生成失败: ${result.error || '未知错误'}`);
    }
  } catch (error) {
    console.error('Face swap failed:', error);
    throw error;
  }
}

// 添加文字水印到图片
export async function addWatermark(
  imageUrl: string,
  raceName: string,
  finishTime: string,
  logoUrl?: string
): Promise<string> {
  // TODO: 使用Sharp或其他图像处理库添加水印
  // 暂时返回原图
  console.log(`添加水印: ${raceName} - ${finishTime}`);
  return imageUrl;
}

// 完整的图片生成流程
export async function generateRunnerImage(
  userFace: File | string,
  templateId: number,
  raceName: string,
  finishTime: string
) {
  try {
    // 1. 上传用户头像到临时存储
    let userFaceUrl: string;
    if (typeof userFace === 'string') {
      userFaceUrl = userFace;
    } else {
      // TODO: 上传到Supabase Storage或临时存储
      userFaceUrl = await uploadToTempStorage(userFace);
    }

    // 2. 获取模版图片URL
    const templateUrl = await getTemplateImageUrl(templateId);

    // 3. 执行AI换脸
    const swappedImageUrl = await swapFace(userFaceUrl, templateUrl);

    // 4. 添加水印
    const finalImageUrl = await addWatermark(swappedImageUrl, raceName, finishTime);

    return {
      originalFaceUrl: userFaceUrl,
      templateUrl,
      swappedImageUrl,
      finalImageUrl,
    };
  } catch (error) {
    console.error('图片生成失败:', error);
    throw error;
  }
}

// 辅助函数：上传到临时存储
async function uploadToTempStorage(file: File): Promise<string> {
  // TODO: 实现上传到Supabase Storage或Vercel Blob
  // 暂时返回占位符URL
  return `https://picsum.photos/512/512?random=${Date.now()}`;
}

// 辅助函数：获取模版图片URL
async function getTemplateImageUrl(templateId: number): Promise<string> {
  // TODO: 从数据库或配置中获取模版图片URL
  // 暂时返回占位符URL
  return `https://picsum.photos/512/512?random=template_${templateId}`;
}

// 检查API密钥是否有效
export async function checkApiKey(): Promise<boolean> {
  try {
    await replicate.models.list();
    return true;
  } catch (error) {
    console.error('Replicate API key invalid:', error);
    return false;
  }
}

// 获取模型信息
export async function getModelInfo(modelId: string) {
  try {
    // modelId 格式: "owner/name"
    const [owner, name] = modelId.split('/');
    const model = await replicate.models.get(owner, name);
    return model;
  } catch (error) {
    console.error('Failed to get model info:', error);
    throw error;
  }
}
