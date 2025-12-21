-- 创建兑换码表
CREATE TABLE IF NOT EXISTS codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  result_id VARCHAR(100),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '30 days')
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_codes_code ON codes(code);
CREATE INDEX IF NOT EXISTS idx_codes_status ON codes(status);
CREATE INDEX IF NOT EXISTS idx_codes_expires_at ON codes(expires_at);

-- 创建结果表（可选，用于存储生成结果的元数据）
CREATE TABLE IF NOT EXISTS results (
  id VARCHAR(100) PRIMARY KEY,
  user_face_url TEXT,
  template_id INTEGER NOT NULL,
  race_name VARCHAR(200),
  finish_time VARCHAR(20),
  generated_image_url TEXT,
  hd_image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '1 day') NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_results_status ON results(status);
CREATE INDEX IF NOT EXISTS idx_results_expires_at ON results(expires_at);

-- 启用行级安全策略
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 为兑换码表创建策略（允许读取和更新）
CREATE POLICY "Allow read access to codes" ON codes
  FOR SELECT USING (true);

CREATE POLICY "Allow update access to codes" ON codes
  FOR UPDATE USING (status = 'active');

-- 为结果表创建策略
CREATE POLICY "Allow read access to results" ON results
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access to results" ON results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to results" ON results
  FOR UPDATE USING (true);

-- 创建清理过期数据的函数
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- 删除过期的兑换码（30天后）
  DELETE FROM codes WHERE expires_at < NOW();

  -- 删除过期结果（24小时后）
  DELETE FROM results WHERE expires_at < NOW();
END;
$$;

-- 创建定时任务来清理过期数据（可选，需要supabase扩展支持）
-- SELECT cron.schedule('cleanup-expired-data', '0 2 * * *', 'SELECT cleanup_expired_data();');
