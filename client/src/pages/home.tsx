import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Rocket,
  ChevronDown,
  Handshake,
  FileText,
  CreditCard,
  Calculator,
  TrendingUp,
  AlertTriangle,
  Lock,
  MapPin
} from 'lucide-react';

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  fundingAmount: string;
}

interface QualificationState {
  question1: boolean | null;
  question2: boolean | null;
  question3: boolean | null;
}

const AnimatedSection = ({ children, className = "", delay = 0, direction = "up" }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  direction?: "up" | "left" | "right" | "down";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { opacity: 0, x: -100, y: 0 };
      case "right": return { opacity: 0, x: 100, y: 0 };
      case "down": return { opacity: 0, x: 0, y: -50 };
      case "up":
      default: return { opacity: 0, x: 0, y: 50 };
    }
  };

  const getFinalPosition = () => ({ opacity: 1, x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FloatingElement = ({ children, className = "", animationDelay = 0 }: {
  children: React.ReactNode;
  className?: string;
  animationDelay?: number;
}) => (
  <motion.div
    className={className}
    animate={{
      y: [-20, 20, -20],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: animationDelay,
    }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [qualifications, setQualifications] = useState<QualificationState>({
    question1: null,
    question2: null,
    question3: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>();
  
  const allQualified = Object.values(qualifications).every(answer => answer === true);
  const formData = watch();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleQualificationChange = (question: keyof QualificationState, value: string) => {
    setQualifications(prev => ({
      ...prev,
      [question]: value === 'yes'
    }));
  };

  const onSubmit = async (data: FormData) => {
    if (!allQualified) {
      alert('자격 요건을 모두 충족해야 신청이 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setShowSuccessMessage(false);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: data.companyName,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          website: data.website,
          fundingAmount: data.fundingAmount,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage(result.message);
        setShowSuccessMessage(true);
        reset(); // 폼 초기화
        setQualifications({
          question1: null,
          question2: null,
          question3: null,
        });

        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        throw new Error(result.error || '전송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      setSubmitMessage(error instanceof Error ? error.message : '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold flex items-center">
                <TrendingUp className="mr-2 text-blue-600" />
                <span className="font-extrabold tracking-tight">
                  <span className="text-cyan-400">Stock</span><span className="text-blue-600">Deal</span><span className="text-emerald-600">Pin</span>
                </span>
              </div>
            </div>
            <Button 
              onClick={() => scrollToSection('qualification')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              파트너십 신청
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Business analytics and growth charts" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-primary/75 to-accent/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0">
          <FloatingElement className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full">
            <div></div>
          </FloatingElement>
          <FloatingElement 
            className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full" 
            animationDelay={2}
          >
            <div></div>
          </FloatingElement>
          <FloatingElement 
            className="absolute bottom-40 left-20 w-20 h-20 bg-accent-light/30 rounded-full"
            animationDelay={4}
          >
            <div></div>
          </FloatingElement>
          <FloatingElement 
            className="absolute bottom-20 right-40 w-28 h-28 bg-white/5 rounded-full"
            animationDelay={6}
          >
            <div></div>
          </FloatingElement>
          
          {/* Network Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#60A5FA', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#FFFFFF', stopOpacity: 0.2}} />
              </linearGradient>
            </defs>
            <motion.path
              d="M100,200 Q300,100 500,300 T900,200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path
              d="M200,700 Q600,500 800,800"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight hero-text-glow">
              <span className="text-white">사장님은</span> <span className="gradient-text-enhanced font-extrabold">'재고 확보'</span><span className="text-white">만 하세요.</span><br />
              <span className="gradient-text-enhanced font-extrabold">'매입 자금'</span><span className="text-white">은 StockDealPin이 해결합니다.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed">
              <span className="text-blue-100 font-medium">검증된 온라인 판매 사업자</span><span className="text-gray-200">를 위한 스마트한 재고 매입 금융 서비스</span><br />
              <span className="text-white font-semibold">빠르고 안전한</span> <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent font-bold">Stock Deal 파이낸싱</span>
            </p>
            <Button 
              onClick={() => scrollToSection('qualification')}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold"
            >
              <Rocket className="mr-2" />
              파트너십 자격 알아보기
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-2xl" />
        </motion.div>
      </section>

      {/* Pain Points Section */}
      <section id="pain-points" className="py-20 bg-muted relative">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <path d="M0,400 Q200,200 400,300 T800,200 L1200,250 L1200,800 L0,800 Z" fill="url(#chartGradient)" opacity="0.3"/>
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(217, 91%, 25%)', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(217, 91%, 60%)', stopOpacity: 0.2}} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left" className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
                이런 상황에서<br />
                <span className="text-accent">머리 아프셨죠</span>?
              </h2>
              
              <div className="space-y-6">
                <AnimatedSection direction="left" delay={0.2}>
                  <Card className="card-hover bg-card border-destructive/20">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="flex-shrink-0 w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      </div>
                      <p className="text-lg text-foreground leading-relaxed">
                        분명 1,000개 단가로 협상했는데, 당장 100개 살 돈밖에 없어 망설일 때
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
                
                <AnimatedSection direction="left" delay={0.4}>
                  <Card className="card-hover bg-card border-orange-500/20">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-lg text-foreground leading-relaxed">
                        재고 매입 자금 부족으로 좋은 딜을 눈앞에서 놓칠 때
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
                
                <AnimatedSection direction="left" delay={0.6}>
                  <Card className="card-hover bg-card border-yellow-500/20">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-lg text-foreground leading-relaxed">
                        하나의 상품에 자금이 묶여 다양한 재고 포트폴리오를 만들지 못할 때
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional business meeting" 
                  className="rounded-2xl shadow-2xl w-full max-w-lg" 
                />
                <motion.div 
                  className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="text-white text-2xl" />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection direction="down" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              StockDealPin은 <span className="text-accent">'대출'</span>이 아닌<br />
              <span className="text-accent">'스마트 딜'</span>을 제공합니다.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              복잡한 절차 없이, 신뢰를 바탕으로 한 스마트한 재고 매입 파이낸싱
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <AnimatedSection direction="left" delay={0.1}>
              <Card className="group card-hover bg-card border border-border h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-white font-bold text-xl">1</span>
                  </motion.div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Handshake className="text-accent text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">재고 선택</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    원하는 재고와 공급업체를 선택하고 거래를 확정합니다.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection direction="up" delay={0.2}>
              <Card className="group card-hover bg-card border border-border h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-white font-bold text-xl">2</span>
                  </motion.div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-green-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">딜 신청</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    StockDealPin에 재고 매입 파이낸싱을 신청합니다.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection direction="down" delay={0.3}>
              <Card className="group card-hover bg-card border border-border h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-white font-bold text-xl">3</span>
                  </motion.div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">즉시 지급</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    공급업체에 재고 매입 대금을 즉시 지급합니다.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Step 4 */}
            <AnimatedSection direction="right" delay={0.4}>
              <Card className="group card-hover bg-card border border-border h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-white font-bold text-xl">4</span>
                  </motion.div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="text-orange-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">스마트 정산</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    판매 완료 후 간편하고 투명한 정산을 진행합니다.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Partnership Qualification */}
      <section id="qualification" className="py-20 bg-gradient-to-br from-muted to-background relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="down" className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              StockDealPin 파트너십 자격 요건
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              신뢰할 수 있는 비즈니스 파트너와 함께 성장하고 싶습니다.<br />
              아래 3가지 기본 요건을 모두 충족하셔야 StockDeal 파이낸싱 신청이 가능합니다.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up">
            <Card className="bg-card shadow-xl border border-border">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Question 1 */}
                  <AnimatedSection direction="left" delay={0.1}>
                    <Card className={`p-6 border-2 transition-all duration-300 ${
                      qualifications.question1 === true 
                        ? 'border-green-300 bg-green-50 dark:bg-green-950' 
                        : qualifications.question1 === false 
                          ? 'border-red-300 bg-red-50 dark:bg-red-950' 
                          : 'border-border'
                    }`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                        <Building className="text-accent w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          사업자 등록 후 3년이 경과하였습니까?
                        </h4>
                        <RadioGroup 
                          value={qualifications.question1 === null ? '' : qualifications.question1 ? 'yes' : 'no'}
                          onValueChange={(value) => handleQualificationChange('question1', value)}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="q1-yes" />
                            <Label htmlFor="q1-yes" className="text-foreground font-medium cursor-pointer">예</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="q1-no" />
                            <Label htmlFor="q1-no" className="text-foreground font-medium cursor-pointer">아니오</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </Card>
                  </AnimatedSection>

                  {/* Question 2 */}
                  <AnimatedSection direction="left" delay={0.3}>
                    <Card className={`p-6 border-2 transition-all duration-300 ${
                      qualifications.question2 === true 
                        ? 'border-green-300 bg-green-50 dark:bg-green-950' 
                        : qualifications.question2 === false 
                          ? 'border-red-300 bg-red-50 dark:bg-red-950' 
                          : 'border-border'
                    }`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                        <FileText className="text-accent w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          최근 3개년 재무제표 제출이 가능하십니까?
                        </h4>
                        <RadioGroup 
                          value={qualifications.question2 === null ? '' : qualifications.question2 ? 'yes' : 'no'}
                          onValueChange={(value) => handleQualificationChange('question2', value)}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="q2-yes" />
                            <Label htmlFor="q2-yes" className="text-foreground font-medium cursor-pointer">예</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="q2-no" />
                            <Label htmlFor="q2-no" className="text-foreground font-medium cursor-pointer">아니오</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </Card>
                  </AnimatedSection>

                  {/* Question 3 */}
                  <AnimatedSection direction="left" delay={0.5}>
                    <Card className={`p-6 border-2 transition-all duration-300 ${
                      qualifications.question3 === true 
                        ? 'border-green-300 bg-green-50 dark:bg-green-950' 
                        : qualifications.question3 === false 
                          ? 'border-red-300 bg-red-50 dark:bg-red-950' 
                          : 'border-border'
                    }`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                        <MapPin className="text-accent w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          중국과의 무역(수입/수출) 경험이 6개월 이상 되셨습니까?
                        </h4>
                        <RadioGroup 
                          value={qualifications.question3 === null ? '' : qualifications.question3 ? 'yes' : 'no'}
                          onValueChange={(value) => handleQualificationChange('question3', value)}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="q3-yes" />
                            <Label htmlFor="q3-yes" className="text-foreground font-medium cursor-pointer">예</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="q3-no" />
                            <Label htmlFor="q3-no" className="text-foreground font-medium cursor-pointer">아니오</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </Card>
                  </AnimatedSection>
                </div>

                {/* Qualification Feedback */}
                {allQualified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 rounded-xl border-2 border-green-200 bg-green-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white w-4 h-4" />
                      </div>
                      <p className="text-green-800 font-semibold text-lg">
                        자격 요건을 모두 충족하셨습니다. 지금 바로 파트너십을 신청하세요!
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              성장 파트너십 신청하기
            </h3>
            <p className="text-lg text-muted-foreground">
              함께 성장할 준비가 되셨다면, 지금 바로 시작하세요.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="bg-gradient-to-br from-muted to-background shadow-2xl border border-border">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-semibold text-foreground flex items-center">
                        <Building className="mr-2 text-accent w-4 h-4" />
                        업체명
                      </Label>
                      <Input
                        id="companyName"
                        placeholder="회사명을 입력하세요"
                        disabled={!allQualified}
                        {...register('companyName', { required: true })}
                        className={`${!allQualified ? 'bg-muted cursor-not-allowed' : ''}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-sm font-semibold text-foreground flex items-center">
                        <User className="mr-2 text-accent w-4 h-4" />
                        담당자명
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="담당자 성함을 입력하세요"
                        disabled={!allQualified}
                        {...register('contactName', { required: true })}
                        className={`${!allQualified ? 'bg-muted cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center">
                        <Mail className="mr-2 text-accent w-4 h-4" />
                        이메일 주소
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@company.com"
                        disabled={!allQualified}
                        {...register('email', { required: true })}
                        className={`${!allQualified ? 'bg-muted cursor-not-allowed' : ''}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-foreground flex items-center">
                        <Phone className="mr-2 text-accent w-4 h-4" />
                        연락처
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="010-0000-0000"
                        disabled={!allQualified}
                        {...register('phone', { required: true })}
                        className={`${!allQualified ? 'bg-muted cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-semibold text-foreground flex items-center">
                      <Globe className="mr-2 text-accent w-4 h-4" />
                      운영 중인 쇼핑몰 주소 (URL)
                    </Label>
                    <Input
                      id="website"
                      type="text"
                      placeholder="www.yourstore.com 또는 https://www.yourstore.com"
                      disabled={!allQualified}
                      {...register('website', {
                        required: true,
                        pattern: {
                          value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                          message: "올바른 웹사이트 주소를 입력해주세요"
                        }
                      })}
                      className={`${!allQualified ? 'bg-muted cursor-not-allowed' : ''}`}
                    />
                    {errors.website && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.website.message || "올바른 웹사이트 주소를 입력해주세요"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount" className="text-sm font-semibold text-foreground flex items-center">
                      <DollarSign className="mr-2 text-accent w-4 h-4" />
                      필요한 매입 자금 규모
                    </Label>
                    <Input
                      id="fundingAmount"
                      placeholder="예: 3천만 원"
                      disabled={!allQualified}
                      {...register('fundingAmount', { required: true })}
                      className={`${!allQualified ? 'bg-muted cursor-not-allowed' : ''}`}
                    />
                  </div>

                  <div className="pt-6">
                    {showSuccessMessage && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <p className="text-green-800 font-medium">{submitMessage}</p>
                        </div>
                      </div>
                    )}

                    {submitMessage && !showSuccessMessage && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 text-red-600 mr-2" />
                          <p className="text-red-800 font-medium">{submitMessage}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={!allQualified || isSubmitting}
                      className={`w-full px-8 py-4 text-lg font-semibold flex items-center justify-center space-x-2 ${
                        allQualified && !isSubmitting
                          ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <Rocket className="w-4 h-4" />
                      <span>
                        {isSubmitting ? '전송 중...' : '성장 파트너십 신청하기'}
                      </span>
                    </Button>
                    <p className="text-sm text-muted-foreground text-center mt-3">
                      위의 자격 요건을 모두 충족해야 신청이 가능합니다.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 flex items-center justify-center">
              <TrendingUp className="mr-2" />
              <span className="text-cyan-400">Stock</span><span className="text-blue-600">Deal</span><span className="text-emerald-600">Pin</span>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              신뢰할 수 있는 성장 금융 파트너와 함께 여러분의 비즈니스를 한 단계 더 발전시키세요.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-600">
              <p className="text-gray-400">
                © 2024 StockDealPin. 모든 권리 보유.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
