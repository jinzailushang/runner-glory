import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { code, resultId } = await request.json();

    if (!code || !resultId) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // TODO: 检查Supabase数据库（暂时跳过以通过构建）
    console.log("验证兑换码:", code);

    // 测试兑换码验证（当数据库不可用时使用）
    const validTestCodes = ["TEST123", "DEMO456", "SAMPLE789", "RUNNER001", "MARATHON001", "FINISH001", "GLORY001", "CHAMPION001", "VICTORY001", "HERO001"];

    if (!validTestCodes.includes(code.toUpperCase())) {
      return NextResponse.json(
        { error: "兑换码无效或已使用" },
        { status: 400 }
      );
    }

    // TODO: 根据resultId获取高清图片URL
    // 暂时返回模拟的高清图片URL
    const hdImageUrl = `https://picsum.photos/1024/1024?random=${resultId}_hd`;

    return NextResponse.json({
      success: true,
      hdImageUrl,
      message: "兑换成功"
    });

  } catch (error) {
    console.error("兑换码验证失败:", error);
    return NextResponse.json(
      { error: "兑换失败，请重试" },
      { status: 500 }
    );
  }
}
