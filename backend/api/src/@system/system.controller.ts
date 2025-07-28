// src/system/system.controller.ts
import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { exec } from 'child_process';

@Controller('system')
export class SystemController {
  @Get('my-ip')
  getClientIp(@Req() req: Request) {
    let ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
    ip = ip.replace('::ffff:', '');
    return { ip };
  }

  @Post('resolve-hostname')
  resolveHostname(@Body('ip') ip: string): Promise<{ hostname: string | null }> {
    return new Promise((resolve) => {
      exec(`ping -a ${ip} -n 1`, (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve({ hostname: null });
        }

        // Match hostname completo (ex: host.docker.internal)
        const match = stdout.match(/Disparando ([^\s]+) \[/i);
        let hostname = match ? match[1].split('.')[0] : null;

        resolve({ hostname });
      });
    });
  }
}