import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resultId } = await params;

    if (!resultId) {
      return NextResponse.json(
        { error: "缺少结果ID" },
        { status: 400 }
      );
    }

    // TODO: 从数据库或缓存中获取结果
    // 暂时返回模拟数据
    const imageUrl = `https://picsum.photos/512/512?random=${resultId}`;

    return NextResponse.json({
      id: resultId,
      imageUrl,
      status: "completed",
      createdAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("获取结果失败:", error);
    return NextResponse.json(
      { error: "获取结果失败" },
      { status: 500 }
    );
  }
}
