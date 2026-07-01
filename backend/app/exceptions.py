# Hold the standard exceptions the services can raise


class PortfolioException(Exception):
    """Base exception for all application-specific errors"""

    pass


class NotFoundError(PortfolioException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class InvalidFileTypeError(Exception):  # Use PortfolioException if you made it the base class
    """Raised when an uploaded file's MIME type is not in the allowlist."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class FileTooLargeError(Exception):
    """Raised when an uploaded file exceeds the configured size limit."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
