-- 种子数据：初始化测试兑换码
-- 注意：生产环境中这些兑换码应该通过安全的途径生成和管理

INSERT INTO codes (code, status) VALUES
('TEST123', 'active'),
('DEMO456', 'active'),
('SAMPLE789', 'active'),
('RUNNER001', 'active'),
('MARATHON001', 'active'),
('FINISH001', 'active'),
('GLORY001', 'active'),
('CHAMPION001', 'active'),
('VICTORY001', 'active'),
('HERO001', 'active')
ON CONFLICT (code) DO NOTHING;

-- 插入一些示例结果数据（可选）
INSERT INTO results (id, template_id, race_name, finish_time, status) VALUES
('result_test_001', 1, '2025深圳马拉松', '3:30:00', 'completed'),
('result_demo_001', 2, '2025北京马拉松', '4:15:30', 'completed')
ON CONFLICT (id) DO NOTHING;
