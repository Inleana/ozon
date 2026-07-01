from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # App
    app_name: str = "Ozonak.online"
    api_prefix: str = "/api"
    debug: bool = False
    backend_cors_origins: str = "*"

    # Ozon API
    ozon_client_id: str = ""
    ozon_api_key: str = ""
    ozon_api_url: str = "https://api-seller.ozon.ru"

    # DeepSeek AI
    deepseek_api_key: str = ""
    deepseek_model: str = "deepseek-chat"
    deepseek_api_url: str = "https://api.deepseek.com/v1"

    # Database
    database_url: str = (
        "postgresql+asyncpg://ozonak_user:secure_password@postgres:5432/ozonak_db"
    )

    # Redis
    redis_url: str = "redis://redis:6379/0"
    cache_ttl_seconds: int = 300

    # JWT
    secret_key: str = "change_me_super_secret_key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    @property
    def cors_origins(self) -> list[str]:
        if self.backend_cors_origins.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.backend_cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
