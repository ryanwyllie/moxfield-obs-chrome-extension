export const BATTLEFIELD_WINDOW_PORT_NAME = 'obs-window';

export type BattlefieldStylesMessage = {
    type: 'BATTLEFIELD_STYLES',
    hrefs: string[],
};

export type BattlefieldCardSizeMessage = {
    type: 'BATTLEFIELD_CARD_SIZE',
    height: number,
    width: number,
};

export type BattlefieldUpdateMessage = {
    type: 'BATTLEFIELD_UPDATE',
    content: string
}

export type BattlefieldMessage = BattlefieldStylesMessage | BattlefieldCardSizeMessage | BattlefieldUpdateMessage;