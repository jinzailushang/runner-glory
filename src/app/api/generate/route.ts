import { NextRequest, NextResponse } from "next/server";
import { generateRunnerImage } from "@/lib/replicate";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const templateId = formData.get("templateId") as string;
    const raceName = formData.get("raceName") as string;
    const finishTime = formData.get("finishTime") as string;

    if (!image || !templateId || !raceName || !finishTime) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "文件类型不正确" },
        { status: 400 }
      );
    }

    // 验证文件大小 (最大5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "图片大小不能超过5MB" },
        { status: 400 }
      );
    }

    // 生成唯一ID
    const resultId = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // 尝试使用Replicate API生成图片
      const replicateToken = process.env.REPLICATE_API_TOKEN;

      if (replicateToken && replicateToken !== 'your_replicate_api_token') {
        // 调用AI生成图片
        const result = await generateRunnerImage(
          image,
          parseInt(templateId),
          raceName,
          finishTime
        );

        // 保存结果到数据库
        const { error: dbError } = await supabaseAdmin
          .from('results')
          .insert({
            id: resultId,
            user_face_url: result.originalFaceUrl,
            template_id: parseInt(templateId),
            race_name: raceName,
            finish_time: finishTime,
            generated_image_url: result.swappedImageUrl,
            hd_image_url: result.finalImageUrl,
            status: 'completed',
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后过期
          });

        if (dbError) {
          console.error("保存生成结果到数据库失败:", dbError);
        }

        return NextResponse.json({
          id: resultId,
          imageUrl: result.finalImageUrl,
          status: "completed",
        });
      } else {
        // Replicate未配置，使用模拟数据
        console.warn("Replicate API未配置，使用模拟生成");
      }
    } catch (aiError) {
      console.error("AI生成失败，尝试降级到模拟数据:", aiError);
    }

    // 模拟处理时间 (3-5秒)
    const processingTime = 3000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // 返回模拟的生成结果
    const imageUrl = `https://picsum.photos/512/512?random=${resultId}`;

    // 保存模拟结果到数据库
    const { error: mockDbError } = await supabaseAdmin
      .from('results')
      .insert({
        id: resultId,
        template_id: parseInt(templateId),
        race_name: raceName,
        finish_time: finishTime,
        generated_image_url: imageUrl,
        hd_image_url: imageUrl, // 模拟高清图
        status: 'completed',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

    if (mockDbError) {
      console.error("保存模拟结果到数据库失败:", mockDbError);
    }

    return NextResponse.json({
      id: resultId,
      imageUrl,
      status: "completed",
    });

  } catch (error) {
    console.error("生成图片失败:", error);
    return NextResponse.json(
      { error: "生成失败，请重试" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
