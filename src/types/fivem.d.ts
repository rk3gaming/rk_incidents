declare function LoadResourceFile(resourceName: string, fileName: string): string;
declare function GetCurrentResourceName(): string;
declare function IsControlJustReleased(padIndex: number, control: number): boolean;
declare function IsPlayerAceAllowed(playerId: number, permission: string): boolean;
declare function GetPlayerIdentifier(playerId: number, identifierType: number): string; 