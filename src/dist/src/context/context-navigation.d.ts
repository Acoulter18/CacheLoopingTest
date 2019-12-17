import { BBContextEnvironment } from './context-environment';
import { BBContextLegalEntity } from './context-legal-entity';
export interface BBContextNavigation {
    environments: BBContextEnvironment[];
    legalEntities?: BBContextLegalEntity[];
}
