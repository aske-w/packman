import { BinPackingAlgorithm } from './BinPackingAlgorithm.enum';
import { PackingAlgorithmEnum } from '../PackingAlgorithm.interface';
import { OnlineStripPackingAlgorithmEnum } from './OnlineStripPackingAlgorithm.enum';

export type Algorithm = OnlineStripPackingAlgorithmEnum | BinPackingAlgorithm | PackingAlgorithmEnum;
