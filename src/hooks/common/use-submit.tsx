import type { SubmitHandlerOptions } from "@/utils/types/providers/callApi";
import { useState } from "react";
import { type SubmitHandler } from 'react-hook-form';
import { toast } from "sonner";

export function createSubmitHandler<TData, TResponse>({
  loadingMessage,
  successMessage,
  onSubmitFn,
  onError,
  onSuccess,
  setIsSubmitting,
}: SubmitHandlerOptions<TData, TResponse> & {
  setIsSubmitting?: (isSubmitting: boolean) => void;
}): SubmitHandler<TData> {
  return async (data: TData) => {
    setIsSubmitting?.(true);
    const loadingToast = toast.loading(loadingMessage);

    try {
      const [err, response] = await onSubmitFn(data);
      toast.dismiss(loadingToast);

      if (err) {
        toast.error(err.message);
        onError?.(err);
      } else if (response) {
        toast.success(successMessage);
        onSuccess?.(response);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(errorMessage);

      if (error instanceof Error) {
        onError?.(error);
      }
    } finally {
      setIsSubmitting?.(false);
    }
  };
}

export function useSubmitHandler<TData, TResponse>(
  options: Omit<SubmitHandlerOptions<TData, TResponse>, 'onSubmitFn'>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createHandler = (onSubmitFn: SubmitHandlerOptions<TData, TResponse>['onSubmitFn']) => {
    return createSubmitHandler({
      ...options,
      onSubmitFn,
      setIsSubmitting,
    });
  };

  return {
    createHandler,
    isSubmitting,
  };
}
