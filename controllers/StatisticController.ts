import StatisticService from "@/services/StatisticService";

class StatisticController {
    async GetOverviewStatistic() {
        try {
            return await StatisticService.GetOverviewStatistic();
        } catch (error) {
            throw error;
        }
    }

    async GetEvolutionOfRevenueStatistic(year?: number) {
        try {
            return await StatisticService.GetEvolutionOfRevenueStatistic(year);
        } catch (error) {
            throw error;
        }
    }

    async GetRevenueByCategoryStatistic(year?: number) {
        try {
            return await StatisticService.GetRevenueByCategoryStatistic(year);
        } catch (error) {
            throw error;
        }
    }

    async GetFlowerProductStructureStatistic() {
        try {
            return await StatisticService.GetFlowerProductStructureStatistic();
        } catch (error) {
            throw error;
        }
    }

    async GetMinShipDateYear() {
        try {
            return await StatisticService.GetMinShipDateYear();
        } catch (error) {
            throw error;
        }
    }
}

const statisticController = new StatisticController();
export default statisticController;
