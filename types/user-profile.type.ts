export type UserProfileType = {
    id                          : string;
    first_name                  : string;
    last_name                   : string;
    username                    : string;
    email                       : string;
    role                        : string;
    organizations               : string;
    is_password_reset_requested: boolean;
    is_suspended                : boolean;
    user_since                  : number;
    last_login                  : number;
    created_at                  : number;
    updated_at                  : number;
    bio                         : string;
    location                    : string;
    website                     : string;
};
