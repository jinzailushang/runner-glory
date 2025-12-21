import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Image Placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-64 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10" />
              <div className="flex h-full items-center justify-center">
                <Trophy className="h-24 w-24 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            3秒生成你的
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              马拉松高光时刻
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-xl text-slate-300 md:text-2xl">
            AI 换脸技术，告别丑照，拥抱专业完赛照片
          </p>

          {/* CTA Button */}
          <div className="mb-12">
            <Link href="/create">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-orange-500/25"
              >
                <Zap className="mr-2 h-5 w-5" />
                立即制作
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-orange-500/20 p-3">
                  <Zap className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">AI 智能换脸</h3>
              <p className="text-slate-400">先进的AI技术，精准面部识别与合成</p>
            </div>

            <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-orange-500/20 p-3">
                  <Trophy className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">专业模版</h3>
              <p className="text-slate-400">精心设计的马拉松场景，专业摄影品质</p>
            </div>

            <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-orange-500/20 p-3">
                  <Shield className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">隐私保护</h3>
              <p className="text-slate-400">24小时自动删除，不保留任何个人数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
