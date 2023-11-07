export const getCookiesItem = (name: string): string | undefined => {
    return document
        .cookie
        .split('; ')
        .filter(row => row.startsWith(`${name}=`))
        .map(c => c.split('=')[1])[0];
}