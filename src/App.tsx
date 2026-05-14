import React, { useState, useRef } from "react";
import { 
  Activity, 
  Upload, 
  FileText, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  History, 
  Settings, 
  LayoutDashboard,
  LogOut,
  Microscope,
  Stethoscope as StethoscopeIcon,
  Download,
  Share2,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { cn } from "@/src/lib/utils";

// Types
type DiagnosisResult = "Normal" | "Malignant";

interface AnalysisResult {
  pred: DiagnosisResult;
  conf: number;
  inputImg: string;
  camImg: string;
}

interface IntegratedResult {
  finalPred: DiagnosisResult;
  finalConf: number;
}

export default function App() {
  const [step, setStep] = useState<"upload" | "analyzing" | "result">("upload");
  const [mammoFile, setMammoFile] = useState<File | null>(null);
  const [ultraFile, setUltraFile] = useState<File | null>(null);
  const [mammoPreview, setMammoPreview] = useState<string | null>(null);
  const [ultraPreview, setUltraPreview] = useState<string | null>(null);

  const [results, setResults] = useState<{
    mammo: AnalysisResult | null;
    ultra: AnalysisResult | null;
    final: IntegratedResult | null;
  }>({
    mammo: null,
    ultra: null,
    final: null,
  });

  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Simulation logic for AI Analysis
  const runAnalysis = async () => {
    if (!mammoFile || !ultraFile) return;
    
    setStep("analyzing");
    setAnalysisProgress(0);

    // Simulate progress
    const timer = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock results
    const mammoResult: AnalysisResult = {
      pred: Math.random() > 0.5 ? "Malignant" : "Normal",
      conf: Math.floor(Math.random() * 20) + 80, // 80-100%
      inputImg: mammoPreview!,
      camImg: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=2000&auto=format&fit=crop", // Heatmap mock
    };

    const ultraResult: AnalysisResult = {
      pred: Math.random() > 0.5 ? "Malignant" : "Normal",
      conf: Math.floor(Math.random() * 20) + 80,
      inputImg: ultraPreview!,
      camImg: "https://images.unsplash.com/photo-1559757175-534d0c9cde20?q=80&w=2148&auto=format&fit=crop", // Heatmap mock
    };

    const finalResult: IntegratedResult = {
      finalPred: (mammoResult.pred === "Malignant" || ultraResult.pred === "Malignant") ? "Malignant" : "Normal",
      finalConf: Math.floor((mammoResult.conf + ultraResult.conf) / 2),
    };

    setResults({
      mammo: mammoResult,
      ultra: ultraResult,
      final: finalResult,
    });

    setStep("result");
  };

  const handleFileChange = (type: "mammo" | "ultra", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "mammo") {
        setMammoFile(file);
        setMammoPreview(reader.result as string);
      } else {
        setUltraFile(file);
        setUltraPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetAnalysis = () => {
    setStep("upload");
    setMammoFile(null);
    setUltraFile(null);
    setMammoPreview(null);
    setUltraPreview(null);
    setResults({ mammo: null, ultra: null, final: null });
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Microscope size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white italic">ONCO-SCAN <span className="font-light opacity-50 not-italic text-sm">AI</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="진단 대시보드" active />
          <NavItem icon={<History size={20} />} label="분석 기록" />
          <NavItem icon={<FileText size={20} />} label="보고서 생성" />
          <NavItem icon={<Settings size={20} />} label="설정" />
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto z-10 relative">
        <header className="h-16 border-b border-white/10 backdrop-blur-xl bg-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight">유방암 AI 정밀 진단 시스템</h1>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
              <Activity size={12} className="text-blue-400" /> System Active
            </div>
          </div>
          <div className="flex gap-6 text-[10px] font-mono opacity-40 uppercase tracking-widest">
            <span>GPU-ACCELERATED: ON</span>
            <span>MODEL: ResNet-50-BV3</span>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                  
                  <div className="flex items-center gap-3 mb-8 relative">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <StethoscopeIcon size={18} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">병변 진단 데이터 입력 (Intake)</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8 relative">
                    <UploadCard 
                      title="Mammography (맘모그래피)"
                      description="DICOM / CC / MLO 촬영 이미지"
                      file={mammoFile}
                      preview={mammoPreview}
                      onFileChange={(file) => handleFileChange("mammo", file)}
                    />
                    <UploadCard 
                      title="Breast Ultrasound (유방 초음파)"
                      description="고해상도 초음파 스캔 데이터"
                      file={ultraFile}
                      preview={ultraPreview}
                      onFileChange={(file) => handleFileChange("ultra", file)}
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={runAnalysis}
                      disabled={!mammoFile || !ultraFile}
                      className={cn(
                        "flex items-center gap-2 py-3 px-10 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-xl",
                        (!mammoFile || !ultraFile) 
                          ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5" 
                          : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-blue-900/40"
                      )}
                    >
                      <Activity size={16} />
                      AI 멀티모달 분석 시작
                    </button>
                  </div>
                </section>

                <div className="grid grid-cols-3 gap-6">
                  <FeatureInfo 
                    icon={<CheckCircle2 size={18} />} 
                    title="BI-RADS 기준 분류" 
                    text="표준 진단 프로토콜에 따른 자동 매칭"
                  />
                  <FeatureInfo 
                    icon={<CheckCircle2 size={18} />} 
                    title="CAM 영역 시각화" 
                    text="이미지 내 주요 특징점 가중치 맵핑"
                  />
                  <FeatureInfo 
                    icon={<CheckCircle2 size={18} />} 
                    title="통합 소견 제안" 
                    text="다각도 데이터를 통합한 정밀 위험도 산출"
                  />
                </div>
              </motion.div>
            )}

            {step === "analyzing" && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex flex-col items-center justify-center space-y-8"
              >
                <div className="relative w-56 h-56">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="104"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="112"
                      cy="112"
                      r="104"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeLinecap="round"
                      className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      initial={{ strokeDasharray: "653", strokeDashoffset: "653" }}
                      animate={{ strokeDashoffset: 653 - (653 * analysisProgress) / 100 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-5xl font-light text-white">{analysisProgress}<span className="text-xl opacity-30">%</span></span>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-blue-400">AI 심층 분석 및 데이터 합성 중</h2>
                  <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto opacity-70">병변 감지를 위해 멀티모달 특징 벡터를 추출하고 있습니다.</p>
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 pb-12"
              >
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <button 
                    onClick={resetAnalysis}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronRight size={14} className="rotate-180" />
                    새 진단 시작
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                      <Download size={14} /> 리포트 저장
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                      <Share2 size={14} /> 전문의 협진
                    </button>
                  </div>
                </div>

                {/* Main Result Card */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                  <div className={cn(
                    "p-8 border-b border-white/5 flex items-center justify-between relative",
                    results.final?.finalPred === "Malignant" ? "bg-red-500/10" : "bg-emerald-500/10"
                  )}>
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl",
                        results.final?.finalPred === "Malignant" ? "bg-red-600 shadow-red-900/40" : "bg-emerald-600 shadow-emerald-900/40"
                      )}>
                        {results.final?.finalPred === "Malignant" ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">통합 분석 최종 결과</p>
                        <h2 className={cn(
                          "text-4xl font-light tracking-tight",
                          results.final?.finalPred === "Malignant" ? "text-red-400" : "text-emerald-400"
                        )}>
                          {results.final?.finalPred === "Malignant" ? "악성 (Malignant) 의심" : "양성 (Normal/Benign)"}
                        </h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">종합 신뢰도</p>
                      <p className="text-4xl font-light">{results.final?.finalConf}<span className="text-lg opacity-30">%</span></p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 divide-x divide-white/5">
                    <div className="p-8 lg:col-span-2 space-y-8">
                      <h3 className="text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-2 text-white/60">
                        <Microscope size={16} className="text-blue-500" />
                        개별 모달리티 상세 분석
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Mammo Column */}
                        <div className="space-y-4">
                          <ResultBadge label="맘모그래피" result={results.mammo!} />
                          <div className="grid grid-cols-2 gap-4">
                            <ImageDisplay label="Source" src={results.mammo?.inputImg!} />
                            <ImageDisplay label="AI 집중 영역 (CAM)" src={results.mammo?.camImg!} accent="indigo" />
                          </div>
                        </div>

                        {/* Ultra Column */}
                        <div className="space-y-4">
                          <ResultBadge label="초음파" result={results.ultra!} />
                          <div className="grid grid-cols-2 gap-4">
                            <ImageDisplay label="Source" src={results.ultra?.inputImg!} />
                            <ImageDisplay label="AI 집중 영역 (CAM)" src={results.ultra?.camImg!} accent="teal" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-white/[0.02] space-y-8">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-6 text-white/60 text-center">정밀 진단 지표</h3>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: "Mammo", val: results.mammo?.conf },
                              { name: "Ultra", val: results.ultra?.conf }
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: 'rgba(255,255,255,0.4)'}} />
                              <YAxis domain={[0, 100]} fontSize={10} tickLine={false} axisLine={false} tick={{fill: 'rgba(255,255,255,0.4)'}} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                                itemStyle={{ color: '#fff', fontSize: '10px' }}
                              />
                              <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={32}>
                                {results.final?.finalPred === "Malignant" 
                                  ? [0, 1].map((_, i) => <Cell key={i} fill="url(#redGradient)" />) 
                                  : [0, 1].map((_, i) => <Cell key={i} fill="url(#greenGradient)" />)
                                }
                              </Bar>
                              <defs>
                                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#EF4444" />
                                  <stop offset="100%" stopColor="#B91C1C" />
                                </linearGradient>
                                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10B981" />
                                  <stop offset="100%" stopColor="#047857" />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-blue-400">
                          <Info size={14} />
                          AI 분석 소견
                        </h4>
                        <p className="text-xs text-white/60 leading-relaxed font-light">
                          {results.final?.finalPred === "Malignant" 
                            ? "분석된 맘모그래피 데이터에서 불규칙한 미세 석회화 병변이 관찰되며, 초음파 상의 저에코 종괴 특성이 결합되어 악성 가능성이 매우 높습니다. 즉각적인 조직 검사(Biopsy)와 정밀 판독을 권장합니다."
                            : "두 모달리티 데이터 모두에서 악성 의심 징후가 발견되지 않았습니다. 현재 상태는 양성(Benign) 범주에 속하며, 정기적인 추적 관찰을 권장합니다."}
                        </p>
                      </div>

                      <div className="pt-2">
                        <div className="text-[10px] uppercase opacity-40 tracking-widest mb-3">다음 단계 (Action)</div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-tighter transition-all">조직검사 요청</button>
                          <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-tighter transition-all">정기 추적관찰</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-white/10 bg-black/40 backdrop-blur-xl mt-auto flex items-center justify-between px-8 text-[10px] font-mono opacity-40 uppercase tracking-widest">
           <div className="flex gap-6">
             <span>Model Type: CNN-Ensemble-V3</span>
             <span>Inference: 44ms</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
             <span>PACS Secure Link</span>
           </div>
        </footer>
      </main>
    </div>
  );
}

// Sub-components
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-xs uppercase tracking-widest",
      active ? "bg-white/10 text-white shadow-xl shadow-black/20" : "text-white/40 hover:bg-white/5 hover:text-white/80"
    )}>
      <span className={cn(active ? "text-blue-400" : "")}>{icon}</span>
      <span>{label}</span>
      {active && <div className="ml-auto w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
    </div>
  );
}

function UploadCard({ title, description, file, preview, onFileChange }: { 
  title: string, 
  description: string, 
  file: File | null, 
  preview: string | null,
  onFileChange: (file: File) => void 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "group relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px] overflow-hidden",
        file ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-blue-500/30 hover:bg-white/5"
      )}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
        accept="image/*"
      />
      
      {preview ? (
        <div className="absolute inset-0">
          <img src={preview} className="w-full h-full object-cover opacity-20 grayscale brightness-150" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/40">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-bold text-white tracking-widest uppercase">{file?.name}</p>
            <button className="mt-3 text-[9px] uppercase tracking-widest font-bold text-blue-400 py-1.5 px-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10">Modify Entry</button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all mb-4 border border-white/5 group-hover:border-blue-500/20">
            <Upload size={24} />
          </div>
          <h3 className="font-bold text-white/80 text-xs uppercase tracking-[0.2em]">{title}</h3>
          <p className="text-white/30 text-[10px] text-center mt-2 font-mono">{description}</p>
        </>
      )}
    </div>
  );
}

function FeatureInfo({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-3 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/10 transition-all">
      <div className="text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{title}</h4>
        <p className="text-[10px] text-white/30 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function ResultBadge({ label, result }: { label: string, result: AnalysisResult }) {
  const isMalignant = result.pred === "Malignant";
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</span>
        <div className={cn(
          "w-2 h-2 rounded-full",
          isMalignant ? "bg-red-500 animate-pulse" : "bg-emerald-500"
        )}></div>
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-widest",
          isMalignant ? "text-red-400" : "text-emerald-400"
        )}>
          {isMalignant ? "Detected" : "Clear"}
        </span>
      </div>
      <span className="text-xs font-mono font-bold text-white/40">{result.conf}%</span>
    </div>
  );
}

function ImageDisplay({ label, src, accent = "slate" }: { label: string, src: string, accent?: "slate" | "indigo" | "teal" }) {
  const colors = {
    slate: "text-white/40",
    indigo: "text-blue-400",
    teal: "text-emerald-400"
  };

  const borders = {
    slate: "border-white/10",
    indigo: "border-blue-500/30",
    teal: "border-emerald-500/30"
  };

  return (
    <div className="space-y-2">
      <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] text-center", colors[accent])}>{label}</p>
      <div className={cn("aspect-square bg-black rounded-xl overflow-hidden border custom-image-glow", borders[accent])}>
        <img src={src} className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
      </div>
    </div>
  );
}


