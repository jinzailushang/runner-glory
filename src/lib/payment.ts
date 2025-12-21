// 第三方发卡平台集成配置
// 支持的平台：面包多、卡密网等

export interface PaymentPlatform {
  name: string;
  baseUrl: string;
  apiKey?: string;
  productId?: string;
}

export const PAYMENT_PLATFORMS = {
  MANDUO: {
    name: "面包多",
    baseUrl: "https://www.manduo.net",
    // 配置通过环境变量设置
    apiKey: process.env.MANDUO_API_KEY,
    productId: process.env.MANDUO_PRODUCT_ID,
  },
  KAMIWANG: {
    name: "卡密网",
    baseUrl: "https://kamiwang.com",
    apiKey: process.env.KAMIWANG_API_KEY,
    productId: process.env.KAMIWANG_PRODUCT_ID,
  },
} as const;

// 生成支付链接
export function generatePaymentLink(platform: keyof typeof PAYMENT_PLATFORMS = 'MANDUO'): string {
  const config = PAYMENT_PLATFORMS[platform];

  if (!config.apiKey || !config.productId) {
    // 如果未配置，使用默认的演示链接
    return `${config.baseUrl}/buy?product=${config.productId || 'runner-glory-hd'}&price=9.9`;
  }

  // 构造实际的支付链接
  const params = new URLSearchParams({
    product_id: config.productId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/result?payment=success`,
    notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
  });

  return `${config.baseUrl}/api/pay?${params.toString()}`;
}

// 处理支付回调
export async function handlePaymentCallback(
  platform: string,
  orderId: string,
  status: string,
  code?: string
) {
  try {
    if (status === 'success' && code) {
      // 支付成功，生成兑换码
      const redeemCode = await generateRedeemCode();

      // 保存兑换码到数据库
      await saveRedeemCode(redeemCode, orderId);

      return {
        success: true,
        redeemCode,
        message: "支付成功，兑换码已生成"
      };
    } else {
      return {
        success: false,
        message: "支付失败或未完成"
      };
    }
  } catch (error) {
    console.error("处理支付回调失败:", error);
    return {
      success: false,
      message: "处理支付回调失败"
    };
  }
}

// 生成兑换码
function generateRedeemCode(): string {
  // 生成8位随机兑换码
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

// 保存兑换码到数据库（仅在API路由中使用）
function saveRedeemCode(code: string, orderId: string) {
  // 这个函数应该在API路由中调用，而不是在客户端
  console.log("保存兑换码:", code, "订单:", orderId);
}

// 验证订单状态
export function checkOrderStatus(orderId: string): boolean {
  // 这个函数应该在API路由中实现，而不是在客户端
  console.log("检查订单状态:", orderId);
  return false;
}

// 获取产品信息
export const PRODUCT_INFO = {
  name: "跑者高光 - 高清无水印图片",
  description: "1024x1024 高清无水印马拉松完赛照",
  price: 9.9,
  currency: "CNY",
  image: "/product-hd-image.jpg",
};
