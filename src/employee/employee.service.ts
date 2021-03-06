import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeDoc } from 'src/employee/interfaces/employee-document.interface';
import { Employee } from 'src/employee/interfaces/employee.interface';
import { EmployeeDTO } from './employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee') private readonly employeeModel: Model<EmployeeDoc>,
  ) {}

  /*
   *@Description: get all employees
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 17:38:20
   */
  async getAll(): Promise<Employee[]> {
    const employeeDocs = await this.employeeModel.find().exec();
    return employeeDocs.map((doc) => ({
      id: doc._id,
      username: doc.username,
      anumber: doc.anumber,
      team: doc.team,
      location: doc.location,
      squad: doc.squad,
    }));
  }

  /*
   *@Description: get employee by id
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 15:29:58
   */
  async getOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findOne({ _id: id }).exec();
    return {
      id: employee._id,
      username: employee.username,
      anumber: employee.anumber,
      team: employee.team,
      location: employee.location,
      squad: employee.squad,
    };
  }

  /*
   *@Description: get employee by username
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 15:30:14
   */
  async getOneByName(username: string): Promise<Employee> {
    const employee = await this.employeeModel.findOne({ username }).exec();
    return {
      id: employee._id,
      username: employee.username,
      anumber: employee.anumber,
      team: employee.team,
      location: employee.location,
      squad: employee.squad,
    };
  }

  /*
   *@Description: add one employee
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 15:32:03
   */
  async insertOne(employee: EmployeeDTO): Promise<Employee> {
    const retEmployee = await this.employeeModel.create(employee as any);
    return {
      id: retEmployee._id,
      username: retEmployee.username,
      anumber: retEmployee.anumber,
      team: retEmployee.team,
      location: retEmployee.location,
      squad: retEmployee.squad,
    };
  }

  /*
   *@Description: update one employee
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 15:32:31
   */
  async updateOne(employee: EmployeeDTO): Promise<Employee> {
    const { _id } = employee;
    const foundEmployee = await this.employeeModel
      .findOneAndUpdate({ _id }, employee)
      .exec();
    return {
      id: foundEmployee._id,
      username: foundEmployee.username,
      anumber: foundEmployee.anumber,
      team: foundEmployee.team,
      location: foundEmployee.location,
      squad: foundEmployee.squad,
    };
  }

  /*
   *@Description: delete one employee by id
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-22 15:32:47
   */
  async deleteOne(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.employeeModel.remove({ _id: id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
