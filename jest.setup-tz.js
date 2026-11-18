// 固定測試時區，讓日期分組的測試在任何電腦與 CI 上結果一致。
module.exports = async () => {
  process.env.TZ = 'Asia/Taipei';
};
