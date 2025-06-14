"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  Coffee,
  Utensils,
  ShoppingBag,
  Bus,
  Gamepad,
  Smartphone,
  Plane,
  DollarSign,
} from "lucide-react";

// Types
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  correctInsight: string;  // переименовано из insight
  wrongInsight: string;   // новое поле
  emoji: string;
}

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  icon: React.ReactNode;
  color: string;
  category: string;
}

interface SpendingCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "neutral";
  dailyAverage: number;
  monthlyTrend: number;
  weeklyBreakdown: { day: string; amount: number }[];
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  merchant: string;
  icon: React.ReactNode;
  color: string;
}

interface AddFundsModal {
  isOpen: boolean;
  goalId: string | null;
  amount: number;
}

// Data
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "На что ты потратил больше всего в этом месяце?",
    options: ["Еда и напитки", "Одежда", "Развлечения", "Транспорт"],
    correct: 0,
    correctInsight: "Правильно! Еда составила 67% твоего бюджета",
    wrongInsight: "На самом деле, еда составила 67% бюджета",
    emoji: "🍕",
  },
  {
    id: 2,
    question: "Сколько раз ты заказывал доставку за неделю?",
    options: ["1-2 раза", "3-4 раза", "5-6 раз", "Каждый день"],
    correct: 2,
    correctInsight: "Точно! 5-6 раз в неделю - это твой рекорд",
    wrongInsight: "На самом деле ты заказывал 5-6 раз в неделю",
    emoji: "📦",
  },
  {
    id: 3,
    question: "В какое время ты чаще всего тратишь деньги?",
    options: ["Утром", "Днем", "Вечером", "Ночью"],
    correct: 2,
    correctInsight: "Да! Вечером с 19:00 до 23:00 - твое опасное время",
    wrongInsight: "На самом деле ты чаще тратишь вечером (19:00-23:00)",
    emoji: "🌙",
  },
];

const goalsInit: Goal[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    current: 53400,
    target: 80000,
    icon: <Smartphone className="w-5 h-5 text-white" />,
    color: "bg-purple-500",
    category: "Техника",
  },
  {
    id: "2",
    name: "Отпуск с друзьями",
    current: 8500,
    target: 25000,
    icon: <Plane className="w-5 h-5 text-white" />,
    color: "bg-blue-500",
    category: "Путешествия",
  },
  {
    id: "3",
    name: "Gaming Setup",
    current: 12000,
    target: 15000,
    icon: <Gamepad className="w-5 h-5 text-white" />,
    color: "bg-red-500",
    category: "Развлечения",
  },
];

const spendingData: SpendingCategory[] = [
  {
    id: "1",
    name: "Еда",
    amount: 15670,
    percentage: 67,
    icon: <Utensils className="w-5 h-5 text-white" />,
    color: "bg-rose-500",
    trend: "up",
    dailyAverage: 522,
    monthlyTrend: 12,
    weeklyBreakdown: [
      { day: "Пн", amount: 2100 },
      { day: "Вт", amount: 1800 },
      { day: "Ср", amount: 2400 },
      { day: "Чт", amount: 1900 },
      { day: "Пт", amount: 3200 },
      { day: "Сб", amount: 2800 },
      { day: "Вс", amount: 1470 },
    ],
  },
  {
    id: "2",
    name: "Развлечения",
    amount: 4200,
    percentage: 18,
    icon: <Gamepad className="w-5 h-5 text-white" />,
    color: "bg-violet-500",
    trend: "neutral",
    dailyAverage: 140,
    monthlyTrend: 2,
    weeklyBreakdown: [
      { day: "Пн", amount: 300 },
      { day: "Вт", amount: 400 },
      { day: "Ср", amount: 200 },
      { day: "Чт", amount: 500 },
      { day: "Пт", amount: 1000 },
      { day: "Сб", amount: 1200 },
      { day: "Вс", amount: 600 },
    ],
  },
  {
    id: "3",
    name: "Транспорт",
    amount: 2100,
    percentage: 9,
    icon: <Bus className="w-5 h-5 text-white" />,
    color: "bg-cyan-500",
    trend: "down",
    dailyAverage: 70,
    monthlyTrend: -5,
    weeklyBreakdown: [
      { day: "Пн", amount: 400 },
      { day: "Вт", amount: 300 },
      { day: "Ср", amount: 350 },
      { day: "Чт", amount: 300 },
      { day: "Пт", amount: 250 },
      { day: "Сб", amount: 200 },
      { day: "Вс", amount: 300 },
    ],
  },
  {
    id: "4",
    name: "Одежда",
    amount: 1400,
    percentage: 6,
    icon: <ShoppingBag className="w-5 h-5 text-white" />,
    color: "bg-pink-500",
    trend: "up",
    dailyAverage: 47,
    monthlyTrend: 8,
    weeklyBreakdown: [
      { day: "Пн", amount: 100 },
      { day: "Вт", amount: 200 },
      { day: "Ср", amount: 300 },
      { day: "Чт", amount: 150 },
      { day: "Пт", amount: 250 },
      { day: "Сб", amount: 200 },
      { day: "Вс", amount: 200 },
    ],
  },
];

const recentTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1200,
    category: "Еда",
    date: "10.12.2024",
    merchant: "Delivery Club",
    icon: <Utensils className="w-4 h-4 text-white" />,
    color: "bg-rose-500",
  },
  {
    id: "2",
    amount: 500,
    category: "Развлечения",
    date: "09.12.2024",
    merchant: "Steam",
    icon: <Gamepad className="w-4 h-4 text-white" />,
    color: "bg-violet-500",
  },
  {
    id: "3",
    amount: 350,
    category: "Транспорт",
    date: "08.12.2024",
    merchant: "Яндекс.Такси",
    icon: <Bus className="w-4 h-4 text-white" />,
    color: "bg-cyan-500",
  },
  {
    id: "4",
    amount: 800,
    category: "Одежда",
    date: "07.12.2024",
    merchant: "Zara",
    icon: <ShoppingBag className="w-4 h-4 text-white" />,
    color: "bg-pink-500",
  },
];

const FinancialDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [goals, setGoals] = useState(goalsInit);

  const [addFundsModal, setAddFundsModal] = useState<AddFundsModal>({
    isOpen: false,
    goalId: null,
    amount: 0,
  });

  // Функция для открытия модального окна
  const openAddFundsModal = (goalId: string) => {
    setAddFundsModal({
      isOpen: true,
      goalId,
      amount: 0,
    });
  };

  // Функция для закрытия модального окна
  const closeAddFundsModal = () => {
    setAddFundsModal({
      isOpen: false,
      goalId: null,
      amount: 0,
    });
  };

  // Функция для добавления средств
  const addFundsToGoal = () => {
    if (!addFundsModal.goalId || addFundsModal.amount <= 0) return;

    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === addFundsModal.goalId
          ? { ...goal, current: goal.current + addFundsModal.amount }
          : goal
      )
    );

    closeAddFundsModal();
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setShowQuiz(false);
        setCurrentStep(4);
      }
    }, 2500);
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const wrappedSteps = [
    {
      title: "Твой финансовый декабрь 2024",
      subtitle: "Приготовься к шоку! 🔥",
      emoji: "📊",
    },
    {
      title: "47,850₽",
      subtitle: "Потрачено в этом месяце",
      emoji: "💸",
    },
    {
      title: "🍕 PLOT TWIST",
      subtitle: "Еда съела 67% твоего бюджета!",
      emoji: "😱",
    },
  ];

  const renderCoffeeConsumption = (count: number) => {
    const cups = Math.min(count, 15);
    return (
      <div className="flex items-center gap-1 flex-wrap w-full justify-end">
        {Array.from({ length: cups }).map((_, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Coffee className="w-4 h-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{count} чашек кофе в месяц</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-[100% - 8px] min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 p-4 md:p-8">
      <div className="mx-auto">
        <AnimatePresence mode="wait">
          {!showQuiz && currentStep < 3 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <Card className="w-full border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {wrappedSteps[currentStep].emoji}
                  </motion.div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {wrappedSteps[currentStep].title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-400 mt-2">
                    {wrappedSteps[currentStep].subtitle}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <Button
                    onClick={nextStep}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {currentStep === 2 ? "Начать квиз 🎮" : "Дальше →"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {showQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <Card className="w-full border-gray-800 bg-gray-900/50 backdrop-blur-sm text-white">
                <CardHeader className="text-center">
                  <div className="flex justify-center gap-2 mb-4">
                    {quizQuestions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i <= currentQuestion ? "bg-purple-500" : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {quizQuestions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, i) => (
                    <Button
                      key={i}
                      variant={
                        selectedAnswer === i
                          ? i === quizQuestions[currentQuestion].correct
                            ? "default"
                            : "destructive"
                          : "secondary"
                      }
                      className={`w-full text-white justify-start ${
                        showResult &&
                        i === quizQuestions[currentQuestion].correct
                          ? "bg-green-600 hover:bg-green-600"
                          : ""
                      }`}
                      onClick={() => handleQuizAnswer(i)}
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  ))}
                </CardContent>
                {showResult && (
                  <CardFooter
                    className={`rounded-lg m-4 p-4 border ${
                      selectedAnswer === quizQuestions[currentQuestion].correct
                        ? "bg-green-900/30 border-green-800"
                        : "bg-red-900/30 border-red-800"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        selectedAnswer ===
                        quizQuestions[currentQuestion].correct
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedAnswer === quizQuestions[currentQuestion].correct
                        ? quizQuestions[currentQuestion].correctInsight
                        : quizQuestions[currentQuestion].wrongInsight}
                    </p>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          )}

          {currentStep >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 pb-4 md:p-0">
                <div>
                  <h1 className="text-2xl font-bold w-full text-center md:w-auto md:text-left">
                    Финансовая панель
                  </h1>
                  <p className="text-gray-400 w-full text-center md:w-auto md:text-left text-lg mt-3">
                    Обзор ваших расходов за декабрь 2024
                  </p>
                </div>
                <div className="w-full flex justify-center md:w-auto">
                  <Badge
                    variant="default"
                    className="bg-green-900/20 text-green-400 text-lg"
                  >
                    Результат квиза: {score}/{quizQuestions.length}
                  </Badge>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto p-2 gap-3 bg-gray-800 rounded-lg">
                  {["overview", "goals", "spending", "transactions"].map(
                    (tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`relative overflow-hidden rounded-md px-4 py-2 text-sm font-medium transition-all ${
                          activeTab === tab
                            ? "text-white shadow-md bg-gradient-to-r from-purple-600 to-pink-600"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                      >
                        {tab === "overview" && "Обзор"}
                        {tab === "goals" && "Цели"}
                        {tab === "spending" && "Траты"}
                        {tab === "transactions" && "История"}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Общие расходы
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold text-gray-900">
                          📊 47,850₽
                        </CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Самые большие траты
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold text-gray-900">
                          🍕 Еда (67%)
                        </CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Экономия
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold text-gray-900">
                          💸 12,400₽
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>

                  <Card className="border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <span>Рекомендации</span>
                      </CardTitle>
                      <CardDescription>
                        Как улучшить свои финансовые привычки
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Coffee className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Сократите расходы на кофе
                          </h3>
                          <p className="text-sm text-gray-400">
                            Вы тратите около 5,200₽ в месяц на кофе. Попробуйте
                            готовить дома.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-500 p-2 rounded-lg">
                          <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Планируйте питание</h3>
                          <p className="text-sm text-gray-400">
                            Доставка еды обходится вам в 12,000₽ в месяц.
                            Готовьте дома 2-3 раза в неделю.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-500 p-2 rounded-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Открой накопительный счет
                          </h3>
                          <p className="text-sm text-gray-400">
                            Он принесет тебе целых 18% годовых! Так ты сможешь в
                            3 раза быстрее накопить на новый iPhone. Оставь
                            заявку в приложении прямо сейчас!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.map((goal) => {
                      const progress = (goal.current / goal.target) * 100;
                      return (
                        <Card
                          key={goal.id}
                          className="border-gray-800 hover:border-gray-700 transition-colors"
                        >
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${goal.color}`}>
                                {goal.icon}
                              </div>
                              <div>
                                <CardTitle>{goal.name}</CardTitle>
                                <CardDescription>
                                  {goal.category}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">
                                {formatMoney(goal.current)} /{" "}
                                {formatMoney(goal.target)}
                              </span>
                              <span className="text-sm font-medium">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="default"
                              className="w-full text-white"
                              onClick={() => openAddFundsModal(goal.id)}
                            >
                              Добавить средства
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Модальное окно для добавления средств */}
                  {addFundsModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700"
                      >
                        <h3 className="text-xl font-bold mb-4">
                          Добавить средства
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Сумма (₽)
                            </label>
                            <input
                              type="number"
                              value={addFundsModal.amount}
                              onChange={(e) =>
                                setAddFundsModal((prev) => ({
                                  ...prev,
                                  amount: Number(e.target.value),
                                }))
                              }
                              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Введите сумму"
                              min="1"
                            />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="default"
                              onClick={closeAddFundsModal}
                            >
                              Отмена
                            </Button>
                            <Button
                              onClick={addFundsToGoal}
                              disabled={addFundsModal.amount <= 0}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              Добавить
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="spending" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spendingData.map((category) => (
                      <Card key={category.id} className="border-gray-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${category.color}`}
                              >
                                {category.icon}
                              </div>
                              <div>
                                <CardTitle>{category.name}</CardTitle>
                                <CardDescription>
                                  {category.percentage}% от бюджета
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant={
                                category.trend === "up"
                                  ? "destructive"
                                  : category.trend === "down"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {category.trend === "up"
                                ? `+${category.monthlyTrend}%`
                                : category.trend === "down"
                                ? `-${Math.abs(category.monthlyTrend)}%`
                                : "→"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col h-[calc(100%-80px)]">
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-400">
                                Сумма
                              </span>
                              <span className="font-medium">
                                {formatMoney(category.amount)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-400">
                                В день
                              </span>
                              <span className="font-medium">
                                {formatMoney(category.dailyAverage)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-400">
                                Эквивалент кофе
                              </span>
                              <div className="flex items-center gap-1 flex-wrap w-1/2">
                                {renderCoffeeConsumption(
                                  Math.round(category.amount / 300)
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <h4 className="text-sm font-medium mb-2">
                              По дням недели:
                            </h4>
                            <div className="flex justify-start gap-2 md:gap-0 md:justify-between items-stretch flex-wrap w-full">
                              {category.weeklyBreakdown.map((day) => (
                                <Tooltip key={day.day}>
                                  <TooltipTrigger>
                                    <div className="flex flex-col items-center h-full justify-end">
                                      <div
                                        className="w-4 bg-purple-500 rounded-t-sm"
                                        style={{
                                          height: `${
                                            (day.amount /
                                              Math.max(
                                                ...category.weeklyBreakdown.map(
                                                  (d) => d.amount
                                                )
                                              )) *
                                            40
                                          }px`,
                                        }}
                                      />
                                      <span className="text-xs mt-1 text-gray-400">
                                        {day.day}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {day.day}: {formatMoney(day.amount)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="transactions">
                  <Card className="border-gray-800">
                    <CardHeader>
                      <CardTitle>Последние транзакции</CardTitle>
                      <CardDescription>
                        Ваши расходы за последние 7 дней
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={transaction.color}>
                                {transaction.icon}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {transaction.merchant}
                              </p>
                              <p className="text-sm text-gray-400">
                                {transaction.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              -{formatMoney(transaction.amount)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinancialDashboard;
