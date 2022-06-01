export interface UserInterface {
  _id: string;
  login: string;
  balance: number;
  password: string;
  cardCount: number;
  gameState: [
    {
      complete: boolean;
      _id: string;
      card: {
        fields: any;
      };
      opened: any;
      win: boolean;
    },
  ];
}
