from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+pg8000://postgres:1234@localhost:5432/catalogo_productos"

    model_config = {"env_file": ".env"}


settings = Settings()
