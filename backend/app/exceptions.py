# Hold the standard exceptions the services can raise


class PortfolioException(Exception):
    """Base exception for all application-specific errors"""

    pass


class NotFoundError(PortfolioException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
