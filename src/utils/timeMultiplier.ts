export const getMultiplier = (avgTime: number): number => {
    if(avgTime > 75)
        return 1.5;
    if(avgTime > 50)
        return 1.2;
    if(avgTime > 25)
        return 0.9;
    return 0.8;
}