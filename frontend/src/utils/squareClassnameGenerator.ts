export function getSquareClassname(row: number, col: number, isActive: boolean): string {
    let className = 'square';

    if (isActive) {
        className += ' active';
    }

    return className;
}