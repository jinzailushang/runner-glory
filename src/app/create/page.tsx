"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { templates, getTemplatesByCategory } from "@/lib/templates";

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [raceName, setRaceName] = useState("2025 深圳马拉松");
  const [finishTime, setFinishTime] = useState("3:30:00");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 获取不同类别的模版
  const finishTemplates = getTemplatesByCategory('finish').slice(0, 2);
  const medalTemplates = getTemplatesByCategory('medal').slice(0, 2);
  const trackTemplates = getTemplatesByCategory('track').slice(0, 1);
  const victoryTemplates = getTemplatesByCategory('victory').slice(0, 1);

  // 合并为展示用的模版列表
  const displayTemplates = [
    ...finishTemplates,
    ...medalTemplates,
    ...trackTemplates,
    ...victoryTemplates,
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }

    // 验证文件大小 (最大5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("请先上传头像照片");
      return;
    }

    if (!selectedTemplate) {
      toast.error("请选择一个模版");
      return;
    }

    if (!raceName.trim() || !finishTime.trim()) {
      toast.error("请填写完整的赛事信息");
      return;
    }

    setIsLoading(true);

    try {
      // 这里将调用API生成图片
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("templateId", selectedTemplate.toString());
      formData.append("raceName", raceName);
      formData.append("finishTime", finishTime);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("生成失败");
      }

      const result = await response.json();

      // 跳转到结果页面
      router.push(`/result?id=${result.id}`);
    } catch (error) {
      toast.error("生成失败，请重试");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">创建你的完赛照</h1>
          <p className="text-slate-400">上传照片，选择模版，一键生成专业完赛照片</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                1
              </div>
              <span className="ml-2 text-sm text-white">上传照片</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-400">
                2
              </div>
              <span className="ml-2 text-sm text-slate-400">选择模版</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-400">
                3
              </div>
              <span className="ml-2 text-sm text-slate-400">生成结果</span>
            </div>
          </div>
        </div>

        {/* 上传照片区域 */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">上传正脸自拍</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-slate-600 p-8 text-center transition-colors hover:border-orange-500"
              >
                <Upload className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                <p className="text-slate-400">点击上传头像照片</p>
                <p className="mt-2 text-sm text-slate-500">
                  支持 JPG、PNG 格式，最大 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt="上传的头像"
                  width={200}
                  height={200}
                  className="mx-auto rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="mt-4 text-xs text-slate-500">
              照片仅用于 AI 生成，24小时后彻底物理删除，绝不保留人脸数据。
            </p>
          </CardContent>
        </Card>

        {/* 赛事信息 */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">赛事信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                赛事名称
              </label>
              <Input
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                placeholder="例如：2025 深圳马拉松"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                完赛成绩
              </label>
              <Input
                value={finishTime}
                onChange={(e) => setFinishTime(e.target.value)}
                placeholder="例如：3:30:00"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* 模版选择 */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">选择模版</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {displayTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${
                    selectedTemplate === template.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div className="mb-2 h-20 rounded bg-slate-700 flex items-center justify-center overflow-hidden">
                    <Image
                      src={template.thumbnailUrl}
                      alt={template.name}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                      onError={(e) => {
                        // 如果缩略图不存在，显示占位符
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.className = 'text-slate-400 text-sm';
                      }}
                    />
                    <span className="text-slate-400 text-sm hidden">{template.name}</span>
                  </div>
                  <p className="text-sm text-slate-300">{template.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 生成按钮 */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedFile || !selectedTemplate}
            size="lg"
            className="w-full max-w-md"
          >
            {isLoading ? "正在生成..." : "开始生成"}
          </Button>
        </div>
      </div>
    </div>
  );
}
