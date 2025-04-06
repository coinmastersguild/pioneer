import { RiskFactor } from './Transaction';
export interface PhishingResponse {
    domainName: string;
    verified: boolean;
    recommendedAction: RecommendedAction;
    riskFactors: RiskFactor[] | null;
    status: 'IN_PROGRESS' | 'COMPLETE';
}
export declare enum RecommendedAction {
    Block = "BLOCK",
    Warn = "WARN",
    None = "NONE"
}
