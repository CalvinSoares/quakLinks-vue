import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

export function usePlansNavigation() {
  const router = useRouter();

  function openPlans(message?: string) {
    if (message) {
      toast.info(`${message} Veja os planos para liberar esse recurso.`);
    } else {
      toast.info("Confira os planos para entender o que cada nível oferece.");
    }

    return router.push("/dashboard/plans");
  }

  return {
    openPlans,
  };
}
