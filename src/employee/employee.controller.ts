import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Employee } from 'src/employee/interfaces/employee.interface';
import { EmployeeDTO } from './employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  /*
   *@Description: get all employees (get)
   *@ClassAuthor: Terry Wang
   *@Date: 2021-11-22 15:58:51
   */
  @Get()
  async getEmployees(): Promise<Employee[]> {
    return this.employeeService.getAll();
  }

  /*
   *@Description: get Employee by id
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 13:27:52
   */
  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.getOne(id);
  }

  /*
   *@Description: get Employee by username
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 13:27:52
   */
  @Get('/username')
  async getByName(@Query('username') username: string): Promise<Employee> {
    return this.employeeService.getOneByName(username);
  }

  /*
   *@Description: and employee (post)
   *@ClassAuthor: Terry Wang
   *@Date: 2021-11-22 15:58:03
   */
  @Post()
  async newEmployee(@Body() employee: EmployeeDTO): Promise<Employee> {
    return this.employeeService.insertOne(employee);
  }

  /*
   *@Description: update employee (put)
   *@ClassAuthor: Terry Wang
   *@Date: 2021-11-22 15:59:14
   */
  @Put()
  async updateEmployee(@Body() employee: EmployeeDTO): Promise<Employee> {
    return this.employeeService.updateOne(employee);
  }

  /*
   *@Description: delete employee (delete)
   *@ClassAuthor: Terry Wang
   *@Date: 2021-11-22 15:59:29
   */
  @Delete('/:id')
  async deleteEmployee(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.employeeService.deleteOne(id);
  }
}
