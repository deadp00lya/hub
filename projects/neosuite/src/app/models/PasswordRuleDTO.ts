export class PasswordRuleDTO {

    public passwordRuleId: number;
    public minorRules: String;
    public minPassLength: number;
    public maxPassLength: number;
    public declinedLoginCount: number;
    public passExpDuration: number;
    public passConfigType: String;
    public passHistory: number;
    public passwordResetType: String;
    public enabled: Boolean;

    public constructor() {

        this.passwordRuleId = null;
        this.minorRules = null;
        this.minPassLength = null;
        this.maxPassLength = null;
        this.declinedLoginCount = null;
        this.passExpDuration = null;
        this.passConfigType = null;
        this.passHistory = null;
        this.enabled = true;
        this.passwordResetType = null;
    }
}