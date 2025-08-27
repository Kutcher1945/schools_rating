'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockAuth } from '@/lib/mock-auth'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен для заполнения'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email адрес'
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Необходимо принять условия использования'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const result = await mockAuth.signup(formData.name, formData.email, formData.password)
      
      if (!result.success) {
        setErrors({ general: result.error || 'Регистрация не удалась' })
      } else {
        // Successful signup - redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      setErrors({ general: 'Что-то пошло не так. Попробуйте еще раз.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    let strength = 0
    
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    
    return strength
  }

  const passwordStrength = getPasswordStrength()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
        duration: 0.8
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  }

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.95, height: 0 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }

  const strengthVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="flex justify-center" variants={itemVariants}>
          <Link href="/" className="flex items-center space-x-3">
            <motion.div 
              className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg"
              variants={logoVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <h1 className="text-2xl font-bold text-slate-900">Цифровой рейтинг школ</h1>
              <p className="text-sm text-slate-600">Умная система образования</p>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.h2 
          className="mt-8 text-center text-3xl font-bold tracking-tight text-slate-900"
          variants={itemVariants}
        >
          Создать аккаунт
        </motion.h2>
        <motion.p 
          className="mt-2 text-center text-sm text-slate-600"
          variants={itemVariants}
        >
          Уже есть аккаунт?{' '}
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Войти в систему
            </Link>
          </motion.span>
        </motion.p>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white py-10 px-6 shadow-xl sm:rounded-xl sm:px-12 border border-slate-200"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          
          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  className="rounded-lg bg-red-50 border border-red-200 p-4"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="flex items-center">
                    <div className="text-sm text-red-700 font-medium">{errors.general}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Полное имя
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <motion.input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="Введите ваше имя"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    className="mt-2 text-sm text-red-600 font-medium"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email адрес
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="Введите ваш email"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    className="mt-2 text-sm text-red-600 font-medium"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <motion.input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="Создайте пароль"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-50 rounded-r-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: showPassword ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
              
              {/* Password Strength Indicator */}
              <AnimatePresence>
                {formData.password && (
                  <motion.div 
                    className="mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                          key={level}
                          className={`h-1 flex-1 rounded origin-left ${
                            level <= passwordStrength
                              ? passwordStrength < 3
                                ? 'bg-red-400'
                                : passwordStrength < 4
                                ? 'bg-yellow-400'
                                : 'bg-green-400'
                              : 'bg-slate-200'
                          }`}
                          variants={strengthVariants}
                          initial="hidden"
                          animate={level <= passwordStrength ? "visible" : "hidden"}
                          transition={{ duration: 0.3, delay: level * 0.1 }}
                        />
                      ))}
                    </div>
                    <motion.p 
                      className="text-xs text-slate-500 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Сложность пароля: {
                        passwordStrength < 3 ? 'Слабый' : 
                        passwordStrength < 4 ? 'Средний' : 'Сильный'
                      }
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    className="mt-2 text-sm text-red-600 font-medium"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <motion.input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="Повторите пароль"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-50 rounded-r-lg transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: showConfirmPassword ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
              <AnimatePresence>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <motion.div 
                    className="mt-2 flex items-center text-green-600"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    >
                      <Check className="w-4 h-4 mr-1" />
                    </motion.div>
                    <span className="text-sm font-medium">Пароли совпадают</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p 
                    className="mt-2 text-sm text-red-600 font-medium"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="flex items-center">
                <motion.input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  whileTap={{ scale: 0.9 }}
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-slate-700 font-medium">
                  Я согласен с{' '}
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      Условиями использования
                    </Link>
                  </motion.span>{' '}
                  и{' '}
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      Политикой конфиденциальности
                    </Link>
                  </motion.span>
                </label>
              </div>
              <AnimatePresence>
                {errors.terms && (
                  <motion.p 
                    className="mt-2 text-sm text-red-600 font-medium"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ 
                  scale: isLoading ? 1 : 1.02,
                  boxShadow: isLoading ? undefined : "0 10px 25px -12px rgba(59, 130, 246, 0.5)"
                }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="rounded-full h-5 w-5 border-b-2 border-white mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Создание аккаунта...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="signup"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Создать аккаунт
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Login link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <p className="text-sm text-slate-600">
              Уже есть аккаунт?{' '}
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Войти в систему
                </Link>
              </motion.span>
            </p>
          </motion.div>

          {/* Demo info */}
          <motion.div 
            className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)" 
            }}
          >
            <div className="flex items-center mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <GraduationCap className="w-4 h-4 text-blue-600 mr-2" />
              </motion.div>
              <h4 className="text-sm font-semibold text-slate-900">Информация для разработчиков</h4>
            </div>
            <div className="text-xs text-slate-600">
              <p>После регистрации вы будете автоматически перенаправлены в систему</p>
            </div>
          </motion.div>

          {/* App info */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <p className="text-xs text-slate-500">
              Система для анализа и рейтинга образовательных учреждений
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}