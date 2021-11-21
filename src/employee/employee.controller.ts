import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Employee } from 'src/employee/interfaces/employee.interface';
import { EmployeeDTO } from './employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get()
  async getEmployees(): Promise<Employee[]> {
    return this.employeeService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.getOne(id);
  }

  @Get('/username')
  async getByName(@Query('username') username: string): Promise<Employee> {
    return this.employeeService.getOneByName(username);
  }

  @Post('/new')
  async newEmployee(@Body() employee: EmployeeDTO): Promise<Employee> {
    return this.employeeService.insertOne(employee);
  }

  @Patch('/update')
  async updateEmployee(@Body() employee: EmployeeDTO): Promise<Employee> {
    return this.employeeService.updateOne(employee);
  }

  @Delete('/delete/:id')
  async deleteEmployee(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.employeeService.deleteOne(id);
  }
}
