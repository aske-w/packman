import { BinPackingAlgorithm } from './BinPackingAlgorithm.enum';
import { PackingAlgorithmEnum } from './OfflineStripPackingAlgorithm.enum';
import { OnlineStripPackingAlgorithmEnum } from './OnlineStripPackingAlgorithm.enum';

export type Algorithm = OnlineStripPackingAlgorithmEnum | BinPackingAlgorithm | PackingAlgorithmEnum;
