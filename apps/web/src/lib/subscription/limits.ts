import { prisma } from '@thebeautypro/database';
import { SUBSCRIPTION_PLANS } from '@/app/api/subscription/plans/route';

export interface PlanLimits {
  canCreateProduct: boolean;
  canCreateCourse: boolean;
  reason?: string;
  currentCount?: number;
  maxAllowed?: number;
}

/**
 * Verifica se o vendedor pode criar um novo produto baseado no plano atual
 */
export async function checkSellerProductLimit(
  userId: string
): Promise<PlanLimits> {
  try {
    // Buscar perfil do vendedor
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
      select: {
        plan: true,
        planExpiresAt: true,
      },
    });

    if (!sellerProfile) {
      return {
        canCreateProduct: false,
        reason: 'Perfil de vendedor não encontrado',
      };
    }

    // Verificar se o plano expirou
    let currentPlan = sellerProfile.plan;
    if (
      sellerProfile.planExpiresAt &&
      new Date(sellerProfile.planExpiresAt) < new Date()
    ) {
      currentPlan = 'FREE';
    }

    // Buscar limites do plano
    const planConfig = SUBSCRIPTION_PLANS[currentPlan];
    if (!planConfig) {
      return {
        canCreateProduct: false,
        reason: 'Configuração de plano não encontrada',
      };
    }

    const maxProducts = planConfig.features.seller.maxProducts;

    // Se ilimitado (-1), pode criar
    if (maxProducts === -1) {
      return {
        canCreateProduct: true,
      };
    }

    // Contar produtos atuais do vendedor (não deletados)
    const currentProductCount = await prisma.product.count({
      where: {
        sellerId: userId,
        // Não contar produtos inativos/deletados na contagem de limite
        status: {
          in: ['ACTIVE', 'DRAFT'],
        },
      },
    });

    // Verificar se atingiu o limite
    if (currentProductCount >= maxProducts) {
      return {
        canCreateProduct: false,
        reason: `Limite de produtos atingido. Seu plano ${planConfig.name} permite até ${maxProducts} produtos.`,
        currentCount: currentProductCount,
        maxAllowed: maxProducts,
      };
    }

    return {
      canCreateProduct: true,
      currentCount: currentProductCount,
      maxAllowed: maxProducts,
    };
  } catch (error) {
    console.error('Erro ao verificar limite de produtos:', error);
    return {
      canCreateProduct: false,
      reason: 'Erro ao verificar limite de produtos',
    };
  }
}

/**
 * Verifica se o instrutor pode criar um novo curso baseado no plano atual
 */
export async function checkInstructorCourseLimit(
  userId: string
): Promise<PlanLimits> {
  try {
    // Buscar perfil do instrutor
    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId },
      select: {
        plan: true,
        planExpiresAt: true,
      },
    });

    if (!instructorProfile) {
      return {
        canCreateCourse: false,
        reason: 'Perfil de instrutor não encontrado',
      };
    }

    // Verificar se o plano expirou
    let currentPlan = instructorProfile.plan;
    if (
      instructorProfile.planExpiresAt &&
      new Date(instructorProfile.planExpiresAt) < new Date()
    ) {
      currentPlan = 'FREE';
    }

    // Buscar limites do plano
    const planConfig = SUBSCRIPTION_PLANS[currentPlan];
    if (!planConfig) {
      return {
        canCreateCourse: false,
        reason: 'Configuração de plano não encontrada',
      };
    }

    const maxCourses = planConfig.features.instructor.maxCourses;

    // Se ilimitado (-1), pode criar
    if (maxCourses === -1) {
      return {
        canCreateCourse: true,
      };
    }

    // Contar cursos atuais do instrutor (não deletados)
    const currentCourseCount = await prisma.course.count({
      where: {
        instructorId: userId,
        // Não contar cursos inativos/deletados na contagem de limite
        status: {
          in: ['PUBLISHED', 'DRAFT'],
        },
      },
    });

    // Verificar se atingiu o limite
    if (currentCourseCount >= maxCourses) {
      return {
        canCreateCourse: false,
        reason: `Limite de cursos atingido. Seu plano ${planConfig.name} permite até ${maxCourses} cursos.`,
        currentCount: currentCourseCount,
        maxAllowed: maxCourses,
      };
    }

    return {
      canCreateCourse: true,
      currentCount: currentCourseCount,
      maxAllowed: maxCourses,
    };
  } catch (error) {
    console.error('Erro ao verificar limite de cursos:', error);
    return {
      canCreateCourse: false,
      reason: 'Erro ao verificar limite de cursos',
    };
  }
}

/**
 * Obtém a taxa de comissão da plataforma baseada no plano
 */
export async function getCommissionRate(
  userId: string,
  type: 'seller' | 'instructor'
): Promise<number> {
  try {
    if (type === 'seller') {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId },
        select: { plan: true, planExpiresAt: true },
      });

      if (!sellerProfile) return 15; // Taxa padrão

      let currentPlan = sellerProfile.plan;
      if (
        sellerProfile.planExpiresAt &&
        new Date(sellerProfile.planExpiresAt) < new Date()
      ) {
        currentPlan = 'FREE';
      }

      const planConfig = SUBSCRIPTION_PLANS[currentPlan];
      return planConfig?.features.seller.commissionRate || 15;
    } else {
      const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId },
        select: { plan: true, planExpiresAt: true },
      });

      if (!instructorProfile) return 20; // Taxa padrão

      let currentPlan = instructorProfile.plan;
      if (
        instructorProfile.planExpiresAt &&
        new Date(instructorProfile.planExpiresAt) < new Date()
      ) {
        currentPlan = 'FREE';
      }

      const planConfig = SUBSCRIPTION_PLANS[currentPlan];
      return planConfig?.features.instructor.commissionRate || 20;
    }
  } catch (error) {
    console.error('Erro ao obter taxa de comissão:', error);
    return type === 'seller' ? 15 : 20; // Taxa padrão em caso de erro
  }
}

/**
 * Verifica se o usuário tem acesso a uma feature específica do plano
 */
export async function hasFeatureAccess(
  userId: string,
  type: 'seller' | 'instructor',
  feature: string
): Promise<boolean> {
  try {
    const profile =
      type === 'seller'
        ? await prisma.sellerProfile.findUnique({
            where: { userId },
            select: { plan: true, planExpiresAt: true },
          })
        : await prisma.instructorProfile.findUnique({
            where: { userId },
            select: { plan: true, planExpiresAt: true },
          });

    if (!profile) return false;

    let currentPlan = profile.plan;
    if (profile.planExpiresAt && new Date(profile.planExpiresAt) < new Date()) {
      currentPlan = 'FREE';
    }

    const planConfig = SUBSCRIPTION_PLANS[currentPlan];
    if (!planConfig) return false;

    const features =
      type === 'seller'
        ? planConfig.features.seller
        : planConfig.features.instructor;

    return features[feature] === true;
  } catch (error) {
    console.error('Erro ao verificar acesso a feature:', error);
    return false;
  }
}
