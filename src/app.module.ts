import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './common/http-error.filter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';


@Module({
  imports: [TypeOrmModule.forRoot(), NoteModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }],
})
export class AppModule {}
