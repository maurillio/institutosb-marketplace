'use client';

import { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  className = '',
  required = false,
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Formatar valor para exibição (R$ 1.000,00)
  const formatCurrency = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    if (!numbers) return '';

    // Converte para centavos e depois para reais
    const amount = parseInt(numbers, 10) / 100;

    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Converter valor formatado para número (para enviar ao backend)
  const unformatCurrency = (formatted: string): string => {
    const numbers = formatted.replace(/\D/g, '');
    if (!numbers) return '';
    return (parseInt(numbers, 10) / 100).toFixed(2);
  };

  // Atualizar display quando value externo mudar
  useEffect(() => {
    if (value) {
      // Se o value já está formatado, usa ele
      if (value.includes('R$')) {
        setDisplayValue(value);
      } else {
        // Se é um número, formata
        const cents = Math.round(parseFloat(value) * 100).toString();
        setDisplayValue(formatCurrency(cents));
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Formata o valor digitado
    const formatted = formatCurrency(inputValue);
    setDisplayValue(formatted);

    // Envia o valor numérico para o parent
    const numericValue = unformatCurrency(formatted);
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Seleciona todo o texto quando focar
    e.target.select();
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled}
    />
  );
}
