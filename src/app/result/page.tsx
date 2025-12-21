"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download, RefreshCw, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";
import { generatePaymentLink, PRODUCT_INFO } from "@/lib/payment";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    // 模拟API调用获取生成结果
    const fetchResult = async () => {
      if (!resultId) return;

      try {
        const response = await fetch(`/api/result/${resultId}`);
        if (response.ok) {
          const data = await response.json();
          setGeneratedImage(data.imageUrl);
        } else {
          // 如果没有真实结果，使用占位符
          setTimeout(() => {
            setGeneratedImage("/placeholder-result.jpg");
          }, 3000);
        }
      } catch (error) {
        // 模拟生成过程
        setTimeout(() => {
          setGeneratedImage("/placeholder-result.jpg");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  const handleRegenerate = () => {
    // 返回创建页面重新生成
    window.location.href = "/create";
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      toast.error("请输入兑换码");
      return;
    }

    setIsRedeeming(true);

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: redeemCode,
          resultId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("兑换成功！");
        setShowRedeemDialog(false);
        // 这里可以触发下载高清图
        window.open(data.hdImageUrl, "_blank");
      } else {
        toast.error("兑换码无效或已使用");
      }
    } catch (error) {
      toast.error("兑换失败，请重试");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleGetRedeemCode = () => {
    // 生成支付链接并跳转
    const paymentUrl = generatePaymentLink();
    window.open(paymentUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">正在分析面部骨骼...</h2>
          <p className="text-slate-400">AI 正在为你生成完美的完赛照，请稍候</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">生成完成！</h1>
          <p className="text-slate-400">你的专属马拉松高光时刻已准备就绪</p>
        </div>

        {/* 生成结果 */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50">
          <CardContent className="p-6">
            <div className="relative">
              {generatedImage && (
                <Image
                  src={generatedImage}
                  alt="生成的完赛照"
                  width={400}
                  height={400}
                  className="mx-auto rounded-lg"
                />
              )}

              {/* 水印遮罩 */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-sm opacity-75">预览图 - 完整高清图需解锁</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            variant="outline"
            onClick={handleRegenerate}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重新生成
          </Button>

          <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Download className="mr-2 h-4 w-4" />
                去水印下载高清图
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">解锁高清无水印图片</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                    <CreditCard className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{PRODUCT_INFO.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {PRODUCT_INFO.description}
                  </p>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
                    <p className="text-orange-400 font-semibold text-center">
                      ¥{PRODUCT_INFO.price}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGetRedeemCode}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    获取兑换码 (9.9元)
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-800 px-2 text-slate-400">或输入兑换码</span>
                    </div>
                  </div>

                  <Input
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    placeholder="输入兑换码"
                    className="bg-slate-700 border-slate-600 text-white"
                  />

                  <Button
                    onClick={handleRedeemCode}
                    disabled={isRedeeming}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {isRedeeming ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        验证中...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        兑换高清图
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            生成的图片将在24小时后自动删除，确保你的隐私安全
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">加载中...</h2>
          <p className="text-slate-400">正在准备你的结果</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}
