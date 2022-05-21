export interface User {
    username: string,
    email: string,
    balance: number,
    password: string,
    gameState: [
        {
            card: [/** str № */[/** coll № */], [], []],
            opened: [[], [], []],
            win: boolean
        }
    ]
}