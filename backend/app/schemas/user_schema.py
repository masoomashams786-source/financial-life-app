from app.extensions import ma
from marshmallow import fields, validate, EXCLUDE, pre_load

class UserSchema(ma.Schema):
    class Meta:
        # Unknown fields will be excluded (prevents errors if extra data is sent)
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)  # Read-only, returned to client
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=80)
    )
    email = fields.Email(required=True)
    password = fields.Str(
        load_only=True,  # Only used when creating/updating, never sent to client
        required=True,
        validate=validate.Length(min=6)
    )
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @pre_load
    def process_email(self, data, **kwargs):
        """Ensure email is lowercased and trimmed before validation."""
        if "email" in data and data["email"]:
            data["email"] = data["email"].strip().lower()
        return data
