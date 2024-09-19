import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor () {
        super ({        
            datasources: {
                db : {
                    url :  process.env.DATABASE_URL
                    // url: 'mysql://test_user:test@db:3306/mydatabase'
                }
                
            }
        })
    }
}
