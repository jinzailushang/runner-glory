import { NextRequest, NextResponse } from "next/server";
import { handlePaymentCallback } from "@/lib/payment";

// 处理第三方支付平台的回调
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platform,
      order_id,
      status,
      code,
      sign, // 签名验证
    } = body;

    console.log("收到支付回调:", { platform, order_id, status, code });

    // TODO: 验证签名以确保回调的真实性
    // if (!verifySignature(body, sign)) {
    //   return NextResponse.json({ error: "签名验证失败" }, { status: 400 });
    // }

    const result = await handlePaymentCallback(platform, order_id, status, code);

    if (result.success) {
      console.log("支付处理成功:", result);
      return NextResponse.json({
        success: true,
        message: result.message,
        redeem_code: result.redeemCode,
      });
    } else {
      console.log("支付处理失败:", result.message);
      return NextResponse.json({
        success: false,
        message: result.message,
      }, { status: 400 });
    }

  } catch (error) {
    console.error("支付回调处理失败:", error);
    return NextResponse.json(
      { error: "回调处理失败" },
      { status: 500 }
    );
  }
}

// 获取支付状态
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json(
      { error: "缺少订单ID" },
      { status: 400 }
    );
  }

  try {
    const { checkOrderStatus } = await import("@/lib/payment");
    const isPaid = await checkOrderStatus(orderId);

    return NextResponse.json({
      order_id: orderId,
      status: isPaid ? 'paid' : 'pending',
      paid: isPaid,
    });

  } catch (error) {
    console.error("获取支付状态失败:", error);
    return NextResponse.json(
      { error: "获取状态失败" },
      { status: 500 }
    );
  }
}
