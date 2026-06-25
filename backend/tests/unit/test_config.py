from app.core.config import settings


def test_settings_load():
    assert settings.app_name == "kaps.studio.archive Portfolio Backend"
    assert settings.environment == "development"
    assert settings.debug is True