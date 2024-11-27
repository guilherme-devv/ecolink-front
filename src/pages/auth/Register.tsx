import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, Building2, Home } from 'lucide-react';
import { UserType } from '../../types/auth';
import api from '../../services/api';

const steps = ['type', 'info', 'address', 'confirmation'] as const;
type Step = typeof steps[number];

const baseSchema = z.object({
  type: z.enum(['residential', 'commercial'] as const),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'Nome muito curto'),
  phone: z.string().min(10, 'Telefone inválido'),
  document: z.string().min(11, 'Documento inválido'),
  address: z.string().min(10, 'Endereço muito curto'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  zipCode: z.string().length(8, 'CEP inválido'),
});

type RegisterFormData = z.infer<typeof baseSchema>;

export function Register() {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [userType, setUserType] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(baseSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const fullAddress = `${data.address}, ${data.number}${
        data.complement ? `, ${data.complement}` : ''
      }`;
  
      const requestBody = {
        email: data.email,
        name: data.name,
        type: data.type,
        address: fullAddress,
        phone: data.phone,
        document: data.document,
        password: data.password,
      };
  
      console.log('Enviando:', requestBody);
  
      const response = await api.post('/users', requestBody, {
          headers: {'ngrok-skip-browser-warning': 'true'}
      });
  
      console.log('Resposta da API:', response.data);
      navigate('/login'); 
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar. Tente novamente.');
    }
  };

  const nextStep = async () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const fieldsToValidate = getFieldsForStep(currentStep);
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getFieldsForStep = (step: Step): (keyof RegisterFormData)[] => {
    switch (step) {
      case 'type':
        return ['type'];
      case 'info':
        return ['email', 'password', 'name', 'phone', 'document'];
      case 'address':
        return ['address', 'number', 'city', 'state', 'zipCode'];
      case 'confirmation':
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Recycle className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cadastre-se no EcoLink
          </h2>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 ${
                  index < steps.indexOf(currentStep)
                    ? 'border-green-600'
                    : 'border-gray-300'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center ${
                    index <= steps.indexOf(currentStep)
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      index < steps.indexOf(currentStep)
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="absolute top-8 w-32 text-xs text-center">
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Type Selection Step */}
          {currentStep === 'type' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setUserType('residential');
                  setValue('type', 'residential'); 
                  nextStep();
                }}
                className={`p-6 border-2 rounded-lg flex flex-col items-center gap-4 hover:border-green-500 transition-colors ${
                  userType === 'residential'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Home className="w-12 h-12 text-green-600" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Condomínio Residencial</h3>
                  <p className="text-sm text-gray-600">
                    Para moradores e síndicos de condomínios
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserType('commercial');
                  setValue('type', 'commercial');
                  nextStep();
                }}
                className={`p-6 border-2 rounded-lg flex flex-col items-center gap-4 hover:border-green-500 transition-colors ${
                  userType === 'commercial'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Building2 className="w-12 h-12 text-green-600" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Estabelecimento Comercial</h3>
                  <p className="text-sm text-gray-600">
                    Para empresas e estabelecimentos comerciais
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Personal Information Step */}
          {currentStep === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <input
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {userType === 'residential' ? 'CPF' : 'CNPJ'}
                </label>
                <input
                  {...register('document')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.document && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.document.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Address Step */}
          {currentStep === 'address' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <input
                    {...register('address')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número
                  </label>
                  <input
                    {...register('number')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.number.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <input
                    {...register('city')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <input
                    {...register('state')}
                    maxLength={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  {...register('zipCode')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Confirme seus dados</h3>
              <div className="bg-white shadow rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo de conta</p>
                  <p className="font-medium">
                    {userType === 'residential'
                      ? 'Condomínio Residencial'
                      : 'Estabelecimento Comercial'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{watch('name')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{watch('email')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">
                    {watch('address')}, {watch('number')} - {watch('city')}/
                    {watch('state')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep !== 'type' && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
            )}
            {currentStep !== 'confirmation' ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Concluir Cadastro
              </button>
            )}
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}