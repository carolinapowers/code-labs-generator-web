/**
 * Logger Utility
 *
 * Provides consistent logging with level controls and production filtering
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  level: LogLevel
  prefix?: string
  enableInProduction?: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private config: LoggerConfig
  private isDevelopment: boolean

  constructor(config: LoggerConfig = { level: 'info' }) {
    this.config = config
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log if explicitly enabled
    if (!this.isDevelopment && !this.config.enableInProduction) {
      return level === 'error' // Always log errors
    }

    // Check if log level meets threshold
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level]
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString()
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : ''
    return `${timestamp} ${prefix} [${level.toUpperCase()}] ${message}`
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args)
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args)
    }
  }
}

// Default logger instance
export const logger = new Logger({
  level: (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info',
  enableInProduction: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
})

// Create scoped loggers for different parts of the app
export function createLogger(prefix: string, level?: LogLevel): Logger {
  return new Logger({
    level: level || (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info',
    prefix,
    enableInProduction: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
  })
}

// Convenience exports for common loggers
export const apiLogger = createLogger('API')
export const mcpLogger = createLogger('MCP')
export const clientLogger = createLogger('Client')
