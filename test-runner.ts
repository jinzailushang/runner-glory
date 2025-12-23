#!/usr/bin/env node
/**
 * 测试运行器
 * 运行所有测试并生成报告
 */

import { runIntegrationTests } from './__tests__/integration.test';

async function main() {
  console.log('🚀 RunnerGlory 功能测试套件\n');
  console.log('='.repeat(60));
  
  const exitCode = await runIntegrationTests();
  
  console.log('\n💡 提示:');
  console.log('  - 单元测试需要安装 Jest: npm install --save-dev jest @types/jest ts-jest');
  console.log('  - 运行单元测试: npm test');
  console.log('  - API 测试需要启动开发服务器: npm run dev');
  
  process.exit(exitCode);
}

main().catch(error => {
  console.error('❌ 测试运行器错误:', error);
  process.exit(1);
});

