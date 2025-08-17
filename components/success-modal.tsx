"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, ArrowLeft, Package, User, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "liberar" | "devolver"
  data: {
    coletores?: number[]
    coletor?: number
    usuario: {
      matricula: number
      nome?: string
    }
  }
}

export function SuccessModal({ open, onOpenChange, type, data }: SuccessModalProps) {
  const [countdown, setCountdown] = useState(5)
  const [isManuallyOpen, setIsManuallyOpen] = useState(false)

  const isLiberar = type === "liberar"
  const coletoresList = data.coletores || (data.coletor ? [data.coletor] : [])

  useEffect(() => {
    if (open && !isManuallyOpen) {
      setCountdown(5)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onOpenChange(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [open, onOpenChange, isManuallyOpen])

  const handleManualClose = () => {
    setIsManuallyOpen(false)
    onOpenChange(false)
  }

  const handleStayOpen = () => {
    setIsManuallyOpen(true)
    setCountdown(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
        showCloseButton={false}
      >
        {/* Header com animação */}
        <DialogHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto relative">
            {/* Círculo de fundo animado */}
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center animate-in zoom-in-0 duration-500">
              <div className="w-16 h-16 bg-green-200 dark:bg-green-800/50 rounded-full flex items-center justify-center animate-in zoom-in-0 duration-700 delay-200">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 animate-in zoom-in-0 duration-1000 delay-500" />
              </div>
            </div>
            
            {/* Partículas de celebração */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-1 -left-3 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-1 -right-3 w-2 h-2 bg-green-500 rounded-full animate-bounce delay-700"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-1000"></div>
          </div>

          <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <DialogTitle className="text-xl font-bold text-green-800 dark:text-green-200">
              {isLiberar ? "🎉 Coletor Liberado!" : "✅ Coletor Devolvido!"}
            </DialogTitle>
            <DialogDescription className="text-green-700 dark:text-green-300">
              Operação realizada com sucesso
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Detalhes da operação */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-500">
          {/* Informações do usuário */}
          <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {data.usuario.nome || `Usuário Mat. ${data.usuario.matricula}`}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Matrícula: {data.usuario.matricula}
              </p>
            </div>
          </div>

          {/* Informações dos coletores */}
          <div className="space-y-2">
            {coletoresList.map((numeroColetor, index) => (
              <div 
                key={numeroColetor}
                className={cn(
                  "flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-green-200 dark:border-green-800 animate-in slide-in-from-left-4 duration-500",
                  `delay-[${600 + index * 100}ms]`
                )}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Coletor #{numeroColetor}
                  </p>
                  <div className="flex items-center gap-2">
                    {isLiberar ? (
                      <ArrowRight className="w-3 h-3 text-green-600" />
                    ) : (
                      <ArrowLeft className="w-3 h-3 text-green-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isLiberar ? "Em operação" : "Disponível"}
                    </span>
                  </div>
                </div>
                <Badge 
                  className={cn(
                    "animate-pulse",
                    isLiberar 
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200" 
                      : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                  )}
                >
                  {isLiberar ? "Em Operação" : "Disponível"}
                </Badge>
              </div>
            ))}
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 animate-in fade-in duration-500 delay-1000">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleString("pt-BR")}</span>
          </div>
        </div>

        {/* Footer com countdown */}
        <DialogFooter className="flex-col gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-700">
          {countdown > 0 && !isManuallyOpen && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Fechando automaticamente em {countdown}s
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={handleStayOpen}
              className="flex-1"
              disabled={isManuallyOpen}
            >
              Manter Aberto
            </Button>
            <Button 
              onClick={handleManualClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}