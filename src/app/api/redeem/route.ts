import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { code, resultId } = await request.json();

    if (!code || !resultId) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // 1. 验证兑换码
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (codeError || !codeData) {
      // 检查是否是预设的测试码（用于演示环境）
      const validTestCodes = ["TEST123", "DEMO456", "SAMPLE789", "RUNNER001"];
      if (!validTestCodes.includes(code.toUpperCase())) {
        return NextResponse.json(
          { error: "兑换码无效或已使用" },
          { status: 400 }
        );
      }
    }

    // 2. 获取对应的生成结果
    const { data: resultData, error: resultError } = await supabaseAdmin
      .from('results')
      .select('hd_image_url')
      .eq('id', resultId)
      .single();

    if (resultError || !resultData) {
      return NextResponse.json(
        { error: "未找到对应的生成结果" },
        { status: 404 }
      );
    }

    // 3. 标记兑换码已使用（如果是数据库中的真实码）
    if (codeData) {
      await supabaseAdmin
        .from('codes')
        .update({ 
          status: 'used', 
          used_at: new Date().toISOString(),
          result_id: resultId 
        })
        .eq('id', codeData.id);
    }

    return NextResponse.json({
      success: true,
      hdImageUrl: resultData.hd_image_url,
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
